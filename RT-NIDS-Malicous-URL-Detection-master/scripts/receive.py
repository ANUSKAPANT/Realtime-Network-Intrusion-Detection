import os    
import time
import base64
import pika
import numpy as np
import pandas as pd
import itertools
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
import psycopg2
import psycopg2.extras
from notify import push_notify
import sys



class PcapToNetFlow():
    def __init__(self,pcap_file_name):
        self.pcap_file_name = pcap_file_name

    def convert(self):
        cmd = f"./bin/cfm ./{self.pcap_file_name} ./"
        result = os.system(cmd)
        print(result)
        return f"{self.pcap_file_name}_Flow.csv"
    

class PreProcessNetFlowCsv():
    def __init__(self,csv_file_name):
        self.csv_file_name = csv_file_name
        self.df = pd.read_csv(self.csv_file_name)
        self.drop_columns = None
        self.x = None
        self.y = None

    def set_drop_columns(self,drop_columns):
        self.drop_columns = drop_columns
    
    def drop_unused_column(self):
        self.df = self.df.drop(self.drop_columns,axis=1)

    # Encode text values to dummy variables(i.e. [1,0,0],[0,1,0],[0,0,1] for red,green,blue)
    def encode_text_dummy(self, name):
        dummies = pd.get_dummies(self.df[name])
        for x in dummies.columns:
            dummy_name = f"{name}-{x}"
            self.df[dummy_name] = dummies[x]
        self.df.drop(name, axis=1, inplace=True)

    def pre_process(self):
        self.df['Flow Byts/s'] = self.df['Flow Byts/s'].astype('float32')
        self.df['Flow Pkts/s'] = self.df['Flow Pkts/s'].astype('float32')
        self.df = self.df.replace([np.inf, -np.inf], np.nan)
        self.df = self.df.dropna()
        self.df.loc[self.df['Label']=='No Label', 'Label'] = 0
   
    def split_x_y(self,label_name):
        # Convert a Pandas dataframe to the x,y inputs that TensorFlow needs
        def to_xy(df, target):
            result = []
            for x in df.columns:
                if x != target:
                    result.append(x)
            # find out the type of the target column.  Is it really this hard? :(
            target_type = df[target].dtypes
            target_type = target_type[0] if hasattr(
                target_type, '__iter__') else target_type
            # Encode to int for classification, float otherwise. TensorFlow likes 32 bits.
            if target_type in (np.int64, np.int32):
                # Classification
                dummies = pd.get_dummies(df[target])
                return df[result].values.astype(np.float32), dummies.values.astype(np.float32)
            # Regression
            return df[result].values.astype(np.float32), df[[target]].values.astype(np.float32)
        self.x, self.y = to_xy(self.df,label_name)
        return self.x
    
    def normalize(self):
        scaler = MinMaxScaler()
        self.x = scaler.fit_transform(self.x)
        print(self.x)
    
class NeuralNetworkClassifier():
    def __init__(self,model_name):
        self.model_name = model_name
        self.classifier = None
        self.x = None
        self.y = None
    
    def load_model(self):
        self.classifier = load_model(self.model_name)

    def predict(self,x):
        y_pred = self.classifier.predict(x)
        self.y = np.argmax(y_pred,axis=1)
        print(self.y)
        return self.y


def tensorflow_shutup():
    """
    Make Tensorflow less verbose
    """
    try:
        # noinspection PyPackageRequirements
        import os
        from tensorflow import logging
        logging.set_verbosity(logging.ERROR)
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

        # Monkey patching deprecation utils to shut it up! Maybe good idea to disable this once after upgrade
        # noinspection PyUnusedLocal
        def deprecated(date, instructions, warn_once=True):
            def deprecated_wrapper(func):
                return func
            return deprecated_wrapper

        from tensorflow.python.util import deprecation
        deprecation.deprecated = deprecated

    except ImportError:
        pass

if __name__ == "__main__":
    

    tensorflow_shutup()
    nnc = NeuralNetworkClassifier('../model/dnn-model.hdf5')
    nnc.load_model()

    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.exchange_declare(exchange='logs',exchange_type='fanout')

    result = channel.queue_declare(queue='',exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange='logs',queue = queue_name)

    conn = psycopg2.connect(user = "netvizuser",password = "netviz123",host = "127.0.0.1",port = "5432",database = "netviz")

    print("[*] Waiting for logs. To Exit press ctrl + C")

    def callback(ch,method,properties,body):

        try:
            filename = body.decode("utf-8")
            print(f"working on filename: {filename}")

            # check starting time
            start = time.process_time()

            # convert to netflow csv
            nc = PcapToNetFlow(pcap_file_name=filename)
            csv = nc.convert()

            df = pd.read_csv(csv)
            df = df.reset_index(drop=True)

            print("*** ORIGINAL DATAFRAME ***")
            print(df)
            # this appends the data everytime 

            # preprocess netflow csv
            drop_columns = ['Flow ID','Timestamp','Src IP','Dst IP','Src Port','Dst Port','Protocol']
            preprocessor = PreProcessNetFlowCsv(csv_file_name=csv)
            preprocessor.set_drop_columns(drop_columns)
            preprocessor.drop_unused_column()
            preprocessor.pre_process()
            x = preprocessor.split_x_y('Label')
            y_pred = nnc.predict(x)
            df["Label"] = y_pred
            equiv = {0:"Normal",1:"Threat"}
            df["Label"] = df["Label"].map(equiv)
            df.reset_index(drop=True,inplace=True)
            
            ## time to save the df
            cur = conn.cursor()
            columns = [col.replace(" ","_").replace("/","_per_").lower() for col in df.columns.values]
            ## print(columns)
            table = "dash_trafficlog"
            # df is the dataframe
            df['Timestamp'] = pd.to_datetime(df['Timestamp'])

            total_threats = len(df[df['Label']=="Threat"])
            print(f"total threats {total_threats}")
            if len(df) > 0:
                df_columns = columns
                # create (col1,col2,...)
                columns = ",".join(df_columns)

                # create VALUES('%s', '%s",...) one '%s' per column
                values = "VALUES({})".format(",".join(["%s" for _ in df_columns])) 

                #create INSERT INTO table (columns) VALUES('%s',...)
                insert_stmt = "INSERT INTO {} ({}) {}".format(table,columns,values)

                # print(values)
                # print(insert_stmt)
                psycopg2.extras.execute_batch(cur, insert_stmt, df.values)
                conn.commit()
                cur.close()
                print("dataframe inserted")

                print(f'Total Threats Detected : {total_threats}')
                if total_threats > 0:
                    push_notify(total_threats,"please see the console")

            #let's drop the unwanted pcaps
            if os.path.exists(filename):
                os.remove(filename)
                os.remove(csv)
            else:
                print("Can not delete the file as it doesn't exists")

            # your code here    
            print(f'Total time taken for exection: {time.process_time() - start}')
            print("*************************************************************")

        except Exception as e:
            print("there is error", str(e))

    channel.basic_consume(queue=queue_name,on_message_callback=callback,auto_ack=True)
    channel.start_consuming()


    






