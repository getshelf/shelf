import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef
} from 'react';
import { useDebounce } from 'react-use';
import { ShelfEditor, Element } from 'shelf-editor';
import { observer } from 'mobx-react';
import { RootStoreContext } from '@stores/RootStore';

import styles from './NotePage.css';
import { useParams } from 'react-router';

const initialValue = [
  {
    type: 'title',
    children: [{ text: 'New note' }]
  }
];

export const NotePage = observer(props => {
  const rootStore = useContext(RootStoreContext);
  const { noteId } = useParams();

  const refNoteId = useRef<string>();

  const [isLoading, setLoading] = useState(true);
  const [value, setValue] = useState<Array<Element>>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<Array<Element>>(
    initialValue
  );
  const [, cancel] = useDebounce(() => setDebouncedValue(value), 2000, [value]);

  /**
   * @description Note fetching
   */
  useEffect(() => {
    setLoading(true);

    if (refNoteId.current) {
      rootStore.notesStore.updateDocument(
        refNoteId.current,
        JSON.stringify(value)
      );
    }

    async function fetchNote() {
      const content = await rootStore.notesStore.fetchDocument(noteId!);
      setValue(content);
      setLoading(false);
      refNoteId.current = noteId;
    }

    fetchNote();
  }, [noteId]);

  /**
   * @description Autosave
   */

  useEffect(() => {
    if (isLoading) return;
    rootStore.notesStore.updateDocument(
      noteId!,
      JSON.stringify(debouncedValue)
    );

    return () => cancel();
  }, [debouncedValue]);

  // Editor change handler
  const onChange = useCallback(
    value => {
      if (isLoading) return;
      setValue(value);
    },
    [isLoading]
  );

  const onTitleChange = useCallback(
    title => {
      rootStore.notesStore.updateMeta(noteId!, { title });
    },
    [noteId]
  );

  return (
    <div className={styles.root}>
      {!isLoading && (
        <ShelfEditor
          value={value}
          onChange={onChange}
          onTitleChange={onTitleChange}
        />
      )}
    </div>
  );
});
