declare module 'react-native-alertbox';
declare module 'tipsi-stripe';


type Toast = React.RefObject<
  import("react-native-fast-toast").default
>["current"];

declare var toast: Toast;