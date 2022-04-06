const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'tmp/csv/' });

const router = express.Router();
const {
  earningsGet,
  earningsPatch,
  earningsBatchGet,
  earningsBatchPatch,
} = require('./handlers/earningsHandler');
const { adminMiddleware } = require('./utils/helper');
const { handlerWrapper } = require('./utils/utils');

router.get('/earnings', handlerWrapper(earningsGet));
router.patch('/earnings', adminMiddleware, handlerWrapper(earningsPatch));

router.get('/earnings/batch', handlerWrapper(earningsBatchGet));
router.patch(
  '/earnings/batch',
  upload.single('csv'),
  adminMiddleware,
  handlerWrapper(earningsBatchPatch),
);

module.exports = router;
