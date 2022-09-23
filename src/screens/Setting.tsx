import React, {useEffect, useState} from 'react';
import {Switch, Text, View} from 'react-native';
import * as A from '@amityco/ts-sdk';

export const Setting = () => {
  const [noti, setNoti] = useState(false);
  const onLanding = () => {
    A.getActiveClient().ws.emit(
      'notification.getSetting',
      {
        level: 'user',
      },
      (res: any) => {
        console.log(JSON.stringify(res.data));
        setNoti(
          res.data.notifiableEvents.find((n: any) => n.moduleName === 'social')
            .isPushNotifiable,
        );
      },
    );
  };
  useEffect(() => {
    onLanding();
  }, []);
  return (
    <View>
      <Text>All Device Push Notification</Text>
      <Switch
        onValueChange={async v => {
          setNoti(v);
          A.getActiveClient().ws.emit(
            'notification.saveSetting',
            {
              level: 'user',
              isPushNotifiable: true,
              notifiableEvents: [{moduleName: 'social', isPushNotifiable: v}],
            },
            (res: any) => {
              console.log(JSON.stringify(res.data));
              A.getActiveClient().ws.emit(
                'notification.getSetting',
                {
                  level: 'user',
                },
                (res: any) => {
                  console.log(JSON.stringify(res.data));
                  setNoti(
                    res.data.notifiableEvents.find(
                      (n: any) => n.moduleName === 'social',
                    ).isPushNotifiable,
                  );
                },
              );
            },
          );
        }}
        value={noti}
      />
    </View>
  );
};
