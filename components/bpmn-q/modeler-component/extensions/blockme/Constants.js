/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// QNames of the BlockME constructs
export const BLOCKME_INVOKE_SC_FUNCTION_TASK = "blockme:InvokeSCFunctionTask";
export const BLOCKME_SEND_TX_TASK = "blockme:SendTxTask";
export const BLOCKME_RECEIVE_TX_TASK = "blockme:ReceiveTxTask";
export const BLOCKME_ENSURE_TX_STATE_TASK = "blockme:EnsureTxStateTask";


export const BLOCKME_INVOKE_SC_FUNCTION_TASK_OUTPUT = "blockme:InvokeSCFunctionTaskOutput";
export const BLOCKME_SEND_TX_TASK_OUTPUT = "blockme:SendTxTaskOutput";
export const BLOCKME_RECEIVE_TX_TASK_OUTPUT = "blockme:ReceiveTxTaskOutput";

// Property names of the BlockME constructs
export const SCL = "scl";
export const SIGNATURE = "signature";
export const OUTPUTS = "outputs";
export const INPUT_ARGS = "inArgs";
export const OUTPUT_ARGS = "outArgs";
export const IS_STATEFUL = "isStateful";
export const CORRELATION_ID = "corrId";
export const DEGREE_OF_CONFIDENCE = "doc";
export const VALUE = "value";
export const TIMESTAMP = "timestamp";
export const FROM = "from";
export const REF = "ref";

// list of QuantME attributes to check if a given attribute belongs to the extension or not
 export const BLOCKME_ATTRIBUTES = [
   SCL,
   SIGNATURE,
   OUTPUTS,
   INPUT_ARGS,
   OUTPUT_ARGS,
   IS_STATEFUL,
   CORRELATION_ID,
   DEGREE_OF_CONFIDENCE,
   VALUE,
   TIMESTAMP,
   FROM,
   REF,
];

export const BLOCKME_TASKS = [
  // QNames of the QuantME constructs
  BLOCKME_INVOKE_SC_FUNCTION_TASK,
  BLOCKME_SEND_TX_TASK,
  BLOCKME_ENSURE_TX_STATE_TASK,
  BLOCKME_RECEIVE_TX_TASK
];

export const BLOCKME_DATA_OBJECTS = [
  BLOCKME_SEND_TX_TASK_OUTPUT,
  BLOCKME_INVOKE_SC_FUNCTION_TASK_OUTPUT,
  BLOCKME_RECEIVE_TX_TASK_OUTPUT
];
