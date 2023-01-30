/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { useDispatch, useSelector } from 'react-redux';
import { connectToDatabase } from '../../../features/database/DatabaseSlice';
import { getMetaData } from '../../../features/database/MetadataSlice';
import {
  addFrame, pinFrame, removeFrame, trimFrame,
} from '../../../features/frame/FrameSlice';
import { addAlert } from '../../../features/alert/AlertSlice';
import ServerConnectFrame from '../presentations/ServerConnectFrame';

const ServerConnectFrameContainer = () => {
  const dispatch = useDispatch();
  const currentGraph = useSelector(state => state.metadata.currentGraph);

  const handleConnectToDatabase = () => dispatch(connectToDatabase());
  const handleAddFrame = () => dispatch(addFrame());
  const handleTrimFrame = () => dispatch(trimFrame());
  const handleRemoveFrame = () => dispatch(removeFrame());
  const handlePinFrame = () => dispatch(pinFrame());
  const handleAddAlert = () => dispatch(addAlert());
  const handleGetMetaData = () => dispatch(getMetaData());

  return (
    <ServerConnectFrame
      currentGraph={currentGraph}
      onConnectToDatabase={handleConnectToDatabase}
      onAddFrame={handleAddFrame}
      onTrimFrame={handleTrimFrame}
      onRemoveFrame={handleRemoveFrame}
      onPinFrame={handlePinFrame}
      onAddAlert={handleAddAlert}
      onGetMetaData={handleGetMetaData}
    />
  );
};

export default ServerConnectFrameContainer;

