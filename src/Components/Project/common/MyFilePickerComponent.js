import React, { useState, Fragment } from 'react';
import {
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiSwitch,
  useGeneratedHtmlId,
} from '@elastic/eui';

const MyFilePickerComponent = () => {
  const [files, setFiles] = useState([]);
  const [large, setLarge] = useState(true);
  const filePickerId = useGeneratedHtmlId({ prefix: 'filePicker' });

  const onChange = (files) => {
    setFiles(files.length > 0 ? Array.from(files) : []);
  };

  const renderFiles = () => {
    if (files.length > 0) {
      return (
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              <strong>{file.name}</strong> ({file.size} bytes)
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>Add some files to see a demo of retrieving from the FileList</p>;
    }
  };

  return (
    <Fragment>
      <EuiFlexGroup>
        <EuiFlexItem grow={2}>
         
            <EuiFilePicker
              id={filePickerId}
              multiple
              initialPromptText="Select or drag and drop multiple files"
              onChange={(files) => onChange(files)}
              display={large ? 'large' : 'default'}
              aria-label="Use aria labels when no actual label is in use"
            />
          <EuiSpacer />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText>
            <h3>Files attached</h3>
            {renderFiles()}
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
  );
};

export default MyFilePickerComponent;
