/**
 * Helper class for building JSON representation of Google Docs suitable for
 * the Google Docs REST API.
 *
 * Example:
 *   const doc = new GoogleDocument();
 *   doc.title('This is a doc')
 *     .heading('A heading')
 *     .link('Google', 'www.google.com')
 *     .newLine()
 *     .text('Some long text...');
 *
 *  doc.toJson();
 */
export class GoogleDocument {

  constructor(title) {
    this.title = title;
    this.requests = [];
    this.currentIndex = 1;
  }

  buildDocsUrl(docId) {
    return `https://docs.google.com/document/d/${docId}/edit`;
  }

  writeDoc() {
    return new Promise((resolve, reject) => {
      gapi.client.docs.documents.create({title: this.title}).then((newDoc) => {
        console.log('Doc created');
        console.log(this.buildDocsUrl(newDoc.result.documentId));
        this.documentId = newDoc.result.documentId;
        gapi.client.docs.documents.batchUpdate(
            {documentId: this.documentId, requests: this.requests})
            .then((response) => {
              resolve(response);
            }, reject);
      });
    });
  }

  heading1(text) {
    text += '\n';
    const endIndex = this.currentIndex + text.length;
    this.requests.push({
      insertText: {
        "text": text,
        "location": {
          "index": this.currentIndex
        }
      }
    });
    this.requests.push({
      updateTextStyle: {
        textStyle: {
          bold: true,
        },
        fields: "bold",
        range: {
          startIndex: this.currentIndex,
          endIndex: endIndex
        }
      }
    });
    this.currentIndex = endIndex;
    return this;
  }

  text(text) {
    this.requests.push({
      insertText: {
        "text": text,
        "location": {
          "index": this.currentIndex,
        }
      }
    });
    this.currentIndex += text.length;
    return this;
  }

}