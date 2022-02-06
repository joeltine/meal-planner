/**
 * Class for communication with Google Docs REST API. Assumes gapi.client.docs
 * has been initialized.
 */
export class GoogleDocsClient {

  constructor() {
    if (!gapi || !gapi.client || !gapi.client.docs) {
      throw new Error('No gapi docs client detected!');
    }
  }

  createNewMealPlanDoc(recipes) {
    const doc = {
      title: 'Hello World Doc!',
      body: {
        content: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: "Hi Mom!"
                  }
                }
              ]
            }
          }
        ]
      }
    };
    
    return new Promise(function (resolve, reject) {
      gapi.client.docs.documents.create(doc).then(resolve, reject);
    });
  }
}