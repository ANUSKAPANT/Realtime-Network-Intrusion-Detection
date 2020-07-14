from pusher_push_notifications import PushNotifications

beams_client = PushNotifications(
    instance_id='38dbeee7-632f-4a66-8e10-6f09c792724b',
    secret_key='3E4FEDF0B3645FE816199C0810532CA4B5897549D23D4D2556FEBC1843370D14',
)

def push_notify(no_of_threat,message):
  response = beams_client.publish_to_interests(
    interests=['hello'],
    publish_body={
        'apns': {
            'aps': {
                'alert': 'Hello!'
            }
        },
        'fcm': {
            'notification': {
                'title': f'{no_of_threat} Threats Detected',
                'body': f'{message}'
            }
        }
    }
  )
  print(response['publishId'])
  
