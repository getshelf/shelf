declare module '*.css' {
  const styles: any;
  export = styles;
}

type NoteId = string | boolean;

type SnapshotListener = (snapshot: firebase.firestore.QuerySnapshot) => void;
