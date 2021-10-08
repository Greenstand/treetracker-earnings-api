const express = require('express');

const router = express.Router();
const {
  earningsGet,
  earningsPatch,
  earningsBatchGet,
  earningsBatchPatch,
} = require('./handlers/earningsHandler');

const { handlerWrapper } = require('./utils/utils');

router.get('/earnings', handlerWrapper(earningsGet));
router.patch('/earnings', handlerWrapper(earningsPatch));

router.get('/earnings/batch', handlerWrapper(earningsBatchGet));
router.patch('/earnings/batch', handlerWrapper(earningsBatchPatch));

module.exports = router;
