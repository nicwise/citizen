const AWS = require('aws-sdk');
const { promisify } = require('util');
const debug = require('debug')('citizen');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const S3_BUCKET = process.env.AWS_S3_BUCKET;
if (!S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_S3_BUCKET, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are secret are required.');
}

s3.save = promisify(s3.putObject);
s3.get = promisify(s3.getObject);

module.exports = {
  saveModule: async (path, tarball) => {
    debug(`save the module into ${path}.`);

    if (!path) { throw new Error('path is required.'); }
    if (!tarball) { throw new Error('tarball is required.'); }

    const params = {
      Bucket: S3_BUCKET,
      Key: path,
      Body: tarball,
    };
    const result = await s3.save(params);
    return result;
  },
  hasModule: async (path) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: path,
    };

    try {
      const module = await s3.get(params);
      if (module.Body) {
        return true;
      }
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        return false;
      }

      throw err;
    }

    return false;
  },
  getModule: async (path) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: path,
    };
    const file = await s3.get(params);
    return file.Body;
  },
};
