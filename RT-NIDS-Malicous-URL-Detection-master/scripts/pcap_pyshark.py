import os    
import time
import base64
import requests
import pyshark
import numpy as np
import pandas as pd
import itertools
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn import preprocessing
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from keras.models import load_model
from keras.models import Sequential
from keras.layers.core import Dense, Activation
from keras.layers import Dropout
from keras.callbacks import EarlyStopping
from sklearn.metrics import confusion_matrix
from sklearn.metrics import precision_score,recall_score,f1_score,roc_auc_score,accuracy_score,classification_report


class PcapCapture:
    def __init__(self,interface_name,output_file):
        self.capture = None
        self.interface = interface_name
        self.output_file = output_file
    
    def start(self,packet_count=100):
        print("*** starting packet capture *** ")
        self.capture = pyshark.LiveCapture(interface=self.interface,output_file=self.output_file)
        self.capture.sniff(packet_count=packet_count)
    
    def stop(self):
        print("*** stopping packet capture *** ")
        self.capture.close()


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

        
if __name__ == "__main__":
    
    # load model
    nnc = NeuralNetworkClassifier('../model/dnn-model.hdf5')
    nnc.load_model()

    while True:

        # check starting time
        start = time.process_time()
    
        # sniff live packet    
        filename = "test.pcap"
        cap = PcapCapture(interface_name='wlp2s0',output_file=filename)
        cap.start()
        cap.stop()

        # convert to netflow csv
        nc = PcapToNetFlow(pcap_file_name=filename)
        csv = nc.convert()

        # preprocess netflow csv
        drop_columns = ['Flow ID','Timestamp','Src IP','Dst IP','Src Port','Dst Port','Protocol']
        preprocessor = PreProcessNetFlowCsv(csv_file_name=csv)
        preprocessor.set_drop_columns(drop_columns)
        preprocessor.drop_unused_column()
        # preprocessor.encode_text_dummy('Protocol')
        preprocessor.pre_process()
        x = preprocessor.split_x_y('Label')
        nnc.predict(x)

        # your code here    
        print(time.process_time() - start)



    