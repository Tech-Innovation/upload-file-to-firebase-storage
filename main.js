const core = require('@actions/core')

function stringToJson(str) {
  try {
    return JSON.parse(str)
  } catch (error) {
    throw new Error('Invalid JSON')
  }
}

async function main() {
  try {
    let file = core.getInput('file')
    let destination = core.getInput('destination')
    let serviceAccountCert = core.getInput('service_account_cert')
    let storageBucket = core.getInput('storage_bucket')

    if (!file) {
      throw new Error('File path must be specified')
    }
    if (!destination) {
      throw new Error('Storage file path must be specified')
    }
    if (!serviceAccountCert) {
      throw new Error('Service account cert must be specified')
    }
    if (!storageBucket) {
      throw new Error('Storage bucket must be specified')
    }

    let serviceAccountCertJson = stringToJson(serviceAccountCert)

    const firebaseConfig = {
      credential: admin.credential.cert(serviceAccountCertJson),
      storageBucket: storageBucket
    }

    admin.initializeApp(firebaseConfig)
    var bucket = admin.storage().bucket()

    await bucket.upload(file, {
      gzip: true,
      destination: destination,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
