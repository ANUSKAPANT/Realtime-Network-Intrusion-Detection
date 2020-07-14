package com.ioe.sniffer;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import com.pusher.pushnotifications.PushNotifications;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        PushNotifications.start(getApplicationContext(), "38dbeee7-632f-4a66-8e10-6f09c792724b");
        PushNotifications.addDeviceInterest("hello");
    }
}
