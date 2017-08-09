// export const APP_SERVE_URL = 'http://88.128.18.144:8000';
// export const FILE_SERVE_URL = 'http://88.128.18.144:8000/kit_file_server';
// export const APP_SERVE_URL = 'http://88.128.18.144:7777';
// export const FILE_SERVE_URL = 'http://88.128.18.144:3333/kit_file_server';
// export const APP_SERVE_URL = 'http://localhost:8100';
export const FILE_SERVE_URL = 'http://121.43.226.205:8899';
export const CONTROL_URL_HTTP= 'http://47.92.29.217/api/chat';
export const CONTROL_URL_HTTPS= 'https://47.92.29.2217:84/api/chat';
export const CONTROL_URL_MQTT ='tcp://47.92.29.217:1883';
export const CONTROL_URL_MQTTS ='ssl://47.92.29.217:8883';
export const MQTT_WS_URL='47.92.29.217';
export const MQTT_WS_PORT=8083;

export const CONTROL_ACT_VERIFYCODE='genVerifyCode';
export const CONTROL_ACT_REGISTER='userRegister';
export const CONTROL_ACT_LOGIN='userLogin';
export const CONTROL_ACT_PASCHANGE='passChange';
export const CONTROL_ACT_LOGOUT='userLogout';

export const ERROR_MESSAGE01='user has existed';
export const ERROR_MESSAGE02='invalid verify code';
export const ERROR_MESSAGE03='400 Bad Request';
export const ERROR_MESSAGE04='user not login';
export const ERROR_MESSAGE05='500 Internal Server Error';
export const ERROR_MESSAGE06='not authorized';
export const ERROR_MESSAGE07='input params error';
export const ERROR_MESSAGE08='404 Not Found';
export const ERROR_MESSAGE09='user not existed';

export const EVENTS_ROBOT_STATUS='robotstatus_';
export const EVENTS_ROBOT_STATUS2='robotstatus2_';
export const EVENTS_ROBOT_SELECTED='robotselected';
export const EVENTS_ROBOT_SELECTED_NAME='robotselected_name';
export const EVENTS_USER_PUBLISH='$IOT/spark';
export const EVENTS_USER_WEBRTC='USER_WEBRTC';
export const EVENTS_USER_WEBRTC_CALL='call';
export const EVENTS_USER_WEBRTC_ACCEPT='accept';
export const EVENTS_USER_WEBRTC_REJECT='reject';
export const EVENTS_USER_WEBRTC_CANCEL='cancel';
export const EVENTS_USER_WEBRTC_INIT='init';
export const EVENTS_USER_WEBRTC_OFFER='offer';
export const EVENTS_USER_WEBRTC_ANSWER='answer';
export const EVENTS_USER_WEBRTC_CANDIDATE='candidate';

export const AVATAR_PHOTO_SIZE_LIMIT=2;//头像默认限制大小2M


export const APP_DOWNLOAD = 'http://106.14.238.69:8089/366/download.html';//app下载地址

export const APK_DOWNLOAD = 'http://106.14.238.69:8089/366/366.apk';//apk下载完整地址
export const PAGE_SIZE = 5;//默认分页大小

export const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURUdwTN/p/ODr+eDr+d3p+d/r+uDs+uLt++Tu++Tu+tnt/Nrn+d3p+crc9Nro98rc9OTu+9nm+NPj993p+s7f9oBJE9wAAAAPdFJOUwAcPORiqU/+yPINlXPIMkNqoOwAAAQnSURBVGjexZvbmqsgDIWrgICHyun9n3XUsa2tpwXEdl3u/c38k5AECPF2i1Vd8kYoxbQ2RmumlGh4Wd+uVdkKZjbFRFteBC240OZQWvCCmlpzJQ0gqTil1++DrRB3IA92U/m8UiZSqvoJlgRdJmEndI7DC2EyJJJDvNUmS7pNM1eZbKkEo7k2BNI8tmA0hkhN/W03p7j7zgyh2B2uGdqQSoPVpJKGWBIic3LuQOa/sBez+RruOfmuzUXSh7FdMHOZ2FE+K3Oh1H4NE+ZSid1EMhdrJ6kKfTVYF99f4HmZN88b5gtqf+HoHWcL8xWtIruU3wGb8vuRtRlflfmaqt8Y/GFyrMHSOxdC34fgnJUZJqtIav+mEMdemFzG/JwN/VrOJwW2yMROaBmfyzVctOTDyePaWvuOho3Wdex26MNMnRn+w+jY7RENLT+H0utf+jTyHF6FjOEu19L1aWRZxHj6n2tfiew24szF+BqLabkIIO/6PdmIuMZi2j25ch+LxrbGq4d9/lLbHyrANaSFHe0ALujsFl1i97DllNv36CIz1GC/LhnJJrOhXqIrPBkcADBkco3FVpgNsQgXCuwSKh+TgyVqMFRF+K0BPe3AFQYzqoGC2s2edhgY8bWAtqYw/7IAgi2yQSk8mWRPCWZ4bMFghySyBsGGFqxhsEezGAXjRwA0prFExsERgsD6N2BojWUs2CJgBhaQ4ZYCB5dH0kmBJTNElExJVLme27El2ySkgjaJaZGt9IRBLaBtEd4d8INAg90johIKOuBy8FhNbfBw9IEOe3iZRk/0NXa8jVllyGAG39k8ZZ3+P9CDXVvC4jFfYdCWT6Bz9Nz4AVsvMtBsD89rKtxsAsggd76Yw02fUzLKnVsRBd4acxTr+2y+gO0mO/Z7DgrJ8N/egQNBEQ22sfExdrj2GiDBv246cIMNaCnaV690q+Uz/klz2w8w+tlSPI3rhZkjWr53UqcOow/4Ugu0bezDukPsrZtk/bqna5HqAYTXuky/deWljewsKvBpYDuQx0cBt91WPCNX2GOI7VPk0PefiuwWcUquoAevVO5+hH0+qJYUx0ukgJbQo6brMySPc/joGdfmcDdPfVtv5m3+LfF8mVvoqT5kgtfOVtBwgs/lrnJqZzjhc3vMNngV2RwaQLH53A+Txf6IoKI1+H2VD0ZulkNGnoK7NPlwyGgxVkVi8MJkfccGySQN95nL8AibIwIHlPsYFiTy9OxrydHxSCpP//taVvBAqCUDO3wgdByBdWTgEDECO+RzRwbu42as64aK28R+N1HRcBO+HqBwd5c2v89zufyWqELkYEXOFzllsr+73C9iqiR0R/I1TPcT7FTJorK6ud/oVHPQ7I6Tf95W89MYv+DTsofPW8G2mUy099u1qkveNl03/wGs65o25fPBP8b2sWa3E7RsAAAAAElFTkSuQmCC';


