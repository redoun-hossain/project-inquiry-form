const CONFIG = {
  WEBHOOK_TEST_URL: 'https://arfinsami178.app.n8n.cloud/webhook-test/new-customer',
  WEBHOOK_PROD_URL: 'https://arfinsami178.app.n8n.cloud/webhook/new-customer',
  USE_TEST: false,
  VERSION: 'Version-3.5',
  get WEBHOOK_URL() {
    return this.USE_TEST ? this.WEBHOOK_TEST_URL : this.WEBHOOK_PROD_URL;
  }
};
