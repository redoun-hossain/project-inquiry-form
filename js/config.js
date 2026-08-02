const CONFIG = {
  WEBHOOK_TEST_URL: 'https://n8n.srv1106977.hstgr.cloud/webhook-test/new-customer',
  WEBHOOK_PROD_URL: 'https://n8n.srv1106977.hstgr.cloud/webhook/new-customer',
  USE_TEST: true,
  VERSION: 'Version-3.2',
  get WEBHOOK_URL() {
    return this.USE_TEST ? this.WEBHOOK_TEST_URL : this.WEBHOOK_PROD_URL;
  }
};
