<template>
  <div class="document-uploader mb-3 mt-3">
    <div v-if="imageDocuments.length > 0" class="images mt-5">
      <slot name="convert-images" />
      <image-document
        v-for="doc in imageDocuments"
        :key="doc.id"
        :document="doc"
        :config="config"
        @pageschanged="pagesChanged(doc, $event)"
        @splitpages="splitPages(doc, $event)"
        @imagesconverted="imagesConverted"
        @namechanged="doc.name = $event"
        @docupdated="documentUpdated(doc, $event)"
        @pageupdated="pageUpdated"
        @notnew="doc.new = false" />
    </div>
    <div v-if="pdfDocuments.length > 0" class="documents mt-5">
      <slot name="documents" />
      <div class="mt-3 mb-3">
        <div class="row bg-light pb-2 pt-2 mb-2 border-bottom">
          <div class="col-auto mr-md-auto">
            <input
              v-model="selectAll"
              type="checkbox"
              @click="clickSelectAll" />
          </div>
          <div class="col-auto ml-auto">
            <button
              v-if="canMakeDocument && canMakeResult"
              class="btn btn-sm"
              :class="{ 'btn-success': canMakeResult }"
              :disabled="!canMakeResult"
              data-toggle="tooltip"
              data-placement="top"
              :title="i18n.makeResultsExplanation"
              @click="makeResults">
              <i class="fa fa-certificate" />
              {{ i18n.markAllAsResult }}
            </button>
            <button
              v-if="canApprove"
              class="btn btn-sm"
              :class="{ 'btn-success': canApprove }"
              :disabled="!canApprove"
              @click="approveSelected">
              <i class="fa fa-check" />
              {{ i18n.approveAll }}
            </button>
          </div>
        </div>
        <file-document
          v-for="doc in pdfDocuments"
          :key="doc.id"
          :document="doc"
          :config="config"
          @pageschanged="pagesChanged(doc, $event)"
          @splitpages="splitPages(doc, $event)"
          @imagesconverted="imagesConverted"
          @namechanged="doc.name = $event"
          @docupdated="documentUpdated(doc, $event)"
          @pageupdated="pageUpdated"
          @notnew="doc.new = false" />
      </div>
    </div>

    <div v-if="otherAttachments.length > 0" class="mt-5">
      <hr />
      <slot name="other-files" />
      <file-document
        v-for="doc in otherAttachments"
        :key="doc.id"
        :document="doc"
        :config="config"
        @docupdated="documentUpdated(doc, $event)"
        @makerelevant="makeRelevant(doc)"
        @notnew="doc.new = false" />
    </div>

    <div v-if="canUpload" class="upload mt-5">
      <slot name="upload-header" />
      <file-uploader
        class="mb-3 mt-2"
        :config="config"
        :auto-proceed="true"
        :allowed-file-types="config.settings.allowed_filetypes"
        @upload-success="uploadSuccess" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import I18nMixin from '../../lib/i18n-mixin'
import { postData } from '../../lib/api.js'

import { approveAttachment, createDocument } from './lib/document_utils'
import ImageDocument from './image-document.vue'
import FileDocument from './file-document.vue'
import FileUploader from '../upload/file-uploader.vue'

export default {
  name: 'DocumentUploader',
  components: {
    ImageDocument,
    FileDocument,
    FileUploader
  },
  mixins: [I18nMixin],
  props: {
    config: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      documents: [],
      imageDocId: 0,
      uploadCount: 0,
      exifSupport: null,
      names: {},
      selectAll: false
    }
  },
  computed: {
    isMobile() {
      // device detection
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
    canUpload() {
      return this.message.kind === 'post'
    },
    imageDocuments() {
      return this.documents.filter(
        (d) => !d.irrelevant && d.type === 'imagedoc'
      )
    },
    pdfDocuments() {
      return this.documents.filter(
        (d) => !d.irrelevant && d.type !== 'imagedoc'
      )
    },
    otherAttachments() {
      return this.documents.filter((d) => d.irrelevant)
    },
    canMakeResultDocs() {
      return this.pdfDocuments.filter((d) => {
        return (
          d.selected &&
          d.creatingDocument === undefined &&
          d.attachment &&
          d.attachment.is_pdf &&
          !(d.document || d.attachment.document) &&
          !(d.attachment.redacted || d.attachment.converted)
        )
      })
    },
    canMakeDocument() {
      return this.config.settings.can_make_document
    },
    canMakeResult() {
      return this.canMakeDocument && this.canMakeResultDocs.length > 0
    },
    canApproveDocs() {
      return this.pdfDocuments.filter((d) => {
        return (
          d.selected &&
          d.approving === undefined &&
          d.attachment &&
          !d.attachment.approved &&
          d.attachment.can_approve
        )
      })
    },
    canApprove() {
      return this.canApproveDocs.length > 0
    }
  },
  mounted() {
    this.$root.exifSupport = this.exifSupport = null
    this.testExifSupport()
    this.$root.url = this.config.url
    this.$root.csrfToken = document.querySelector(
      '[name=csrfmiddlewaretoken]'
    ).value
    this.documents = this.buildDocuments(this.message.attachments)
  },
  methods: {
    uploadSuccess({ uppy, response, file }) {
      this.addAttachmentFromTus(response.uploadURL).then(() => {
        uppy.removeFile(file.id)
      })
    },
    testExifSupport() {
      /*
      From Modernizr feature detection:
      https://github.com/Modernizr/Modernizr/blob/master/feature-detects/exif-orientation.js
      */
      const img = new Image()
      img.src =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAABABIBAwABAAAABgASAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q=='
      img.onload = () => {
        document.body.appendChild(img)
        const rect = img.getBoundingClientRect()
        this.$root.exifSupport = this.exifSupport = rect.height === 2
        document.body.removeChild(img)
      }
    },
    addAttachmentFromTus(uploadUrl) {
      return postData(
        this.config.url.convertAttachments,
        {
          action: 'add_tus_attachment',
          upload: uploadUrl
        },
        this.$root.csrfToken
      ).then((result) => {
        if (result.error) {
          throw new Error(result.message)
        }
        const att = result.added[0]
        this.addAttachment(att)
      })
    },
    buildDocuments(attachments, extra = {}) {
      const documents = []
      let images = []
      attachments.forEach((att) => {
        const doc = {
          id: att.id,
          name: att.name,
          filetype: att.filetype,
          pending: att.pending,
          file_url: att.file_url,
          pages: null,
          attachment: att,
          ...extra
        }
        let imagePage = false

        if (att.is_irrelevant) {
          doc.irrelevant = true
        } else if (att.is_pdf) {
          doc.type = 'pdf'
        } else if (att.is_image) {
          if (att.converted) {
            doc.irrelevant = true
          } else {
            imagePage = true
            images.push({
              id: att.id,
              name: att.name,
              attachment: att,
              file_url: att.file_url
            })
          }
        }
        if (!imagePage) {
          documents.push(doc)
        }
        this.names[att.name] = true
      })
      if (images.length > 0) {
        images = this.prepareImages(images)
        documents.unshift(
          this.getNewImageDoc({
            pages: images,
            new: false
          })
        )
      }
      return documents
    },
    prepareImages(images) {
      images = images
        .sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
        .map((x, i) => {
          x.pageNum = i + 1
          return x
        })
      return images
    },
    pagesChanged(doc, pages) {
      pages.forEach((p, i) => {
        p.pageNum = i + 1
      })
      doc.pages = pages
    },
    pageUpdated({ document, pageNum, data }) {
      const page = document.pages[pageNum - 1]
      for (const key in data) {
        Vue.set(page, key, data[key])
      }
    },
    splitPages(doc, pageNum) {
      const newPages = doc.pages.slice(pageNum)
      newPages.forEach((p, i) => {
        p.pageNum = i + 1
      })
      doc.pages = doc.pages.slice(0, pageNum)
      doc.new = true
      this.documents = [
        ...this.documents.filter((d) => d.type === 'imagedoc'),
        this.getNewImageDoc({
          pages: newPages
        }),
        ...this.documents.filter((d) => d.type !== 'imagedoc')
      ]
    },
    getNewImageDoc(data) {
      this.imageDocId += 1
      return {
        id: 'imagedoc' + this.imageDocId,
        filetype: null,
        type: 'imagedoc',
        new: true,
        name: '',
        ...data
      }
    },
    imagesConverted({ attachment, imageDoc }) {
      // Remove image doc
      this.documents = this.documents.filter((d) => d.id !== imageDoc.id)
      // add new attachment to top
      this.documents = [
        ...this.documents.filter((d) => d.type === 'imagedoc'),
        ...this.buildDocuments([attachment], {
          new: true
        }),
        ...this.documents.filter((d) => d.type !== 'imagedoc')
      ]
    },
    documentUpdated(doc, update) {
      if (update === null) {
        this.documents = this.documents.filter((d) => d.id !== doc.id)
        return
      }
      for (const key in update) {
        if (key === 'document') {
          Vue.set(doc.attachment, key, update[key])
        } else {
          Vue.set(doc, key, update[key])
        }
      }
    },
    makeRelevant(doc) {
      if (doc.attachment.is_image) {
        const imageDoc = this.documents.filter((d) => d.type === 'imagedoc')
        if (imageDoc.length > 0) {
          doc.pageNum = imageDoc[0].pages.length + 1
          Vue.set(imageDoc[0], 'pages', [...imageDoc[0].pages, doc])
        } else {
          doc.pageNum = 1
          this.documents = [
            ...this.documents,
            this.getNewImageDoc({
              pages: [doc],
              new: true
            })
          ]
        }
        this.documents = this.documents.filter((d) => d.id !== doc.id)
      } else {
        Vue.set(doc, 'irrelevant', false)
      }
    },
    clickSelectAll() {
      this.pdfDocuments.forEach((d) => {
        Vue.set(d, 'selected', !this.selectAll)
      })
    },
    approveSelected() {
      return Promise.all(
        this.canApproveDocs.map((d) => {
          Vue.set(d, 'approving', true)
          return approveAttachment(d, this.config, this.$root.csrfToken).then(
            (att) => {
              Vue.set(d, 'approving', false)
              Vue.set(d, 'attachment', att)
            }
          )
        })
      )
    },
    addImages(images) {
      const imageDocs = this.documents.filter((d) => d.type === 'imagedoc')
      if (imageDocs.length === 0) {
        this.documents = [
          this.getNewImageDoc({
            pages: images.map((i, c) => {
              i.pageNum = c + 1
              return i
            })
          }),
          ...this.documents
        ]
      } else {
        const imageDoc = imageDocs[0]
        imageDoc.pages = [
          ...imageDoc.pages,
          ...images.map((i, c) => {
            i.pageNum = imageDoc.pages.length + c + 1
            return i
          })
        ]
      }
    },
    addAttachment(att) {
      if (att.is_image) {
        this.addImages([att])
      } else {
        this.documents = [
          ...this.buildDocuments([att], { new: true }),
          ...this.documents
        ]
      }
    },
    makeResults() {
      return Promise.all(
        this.canMakeResultDocs.map((d) => {
          Vue.set(d, 'creatingDocument', false)
          return createDocument(d, this.config, this.$root.csrfToken).then(
            (data) => {
              Vue.set(d.attachment, 'document', data)
              Vue.set(d, 'creatingDocument', null)
            }
          )
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@uppy/core/dist/style.css';
@import '~@uppy/dashboard/dist/style.css';

.upload label.isMobile {
  display: block;
  text-align: center;
}
</style>
