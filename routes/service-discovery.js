const { Router } = require('express');

const router = Router();

const { HOSTNAME } = process.env;

if (!HOSTNAME) { throw new Error('HOSTNAME required.'); }

// ref: https://www.terraform.io/docs/internals/remote-service-discovery.html
router.get('/.well-known/terraform.json', (req, res) => {
  res.json({
    'modules.v1': `/v1/modules/`,
  });
});

module.exports = router;
