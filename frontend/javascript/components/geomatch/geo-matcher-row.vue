<template>
  <tr
    :class="{ loading: georegion.loading }"
    :data-region="georegion.resource_uri">
    <td>
      <a :href="georegionAdminUrl" target="_blank">
        {{ georegion.name }}
      </a>
    </td>
    <td>{{ georegion.kind_detail }}</td>
    <td>
      <ul v-if="hasLinks">
        <li v-for="link in links" :key="link.id">
          <a :href="link.url" target="_blank">
            {{ link.name }}
          </a>
          (<span v-if="link.categories.length > 0"
            ><template v-for="cat in link.categories"
              >{{ cat.name }},
            </template></span
          >) -
          <span v-if="link.classification">{{ link.classification.name }}</span>
        </li>
      </ul>
    </td>
    <td>
      <div v-if="georegion.loading" class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <ul v-if="hasMatches">
        <li v-for="match in matches" :key="match.id">
          <a :href="match.url" target="_blank">
            {{ match.name }}
          </a>
          (
          <span>{{ match.jurisdiction.name }}</span
          >,
          <span v-if="match.categories.length > 0">{{
            match.categories[0].name
          }}</span>
          )
          <button @click="connect(match)">Connect</button>
        </li>
      </ul>
      <a v-if="hasMatches" :href="createPublicBodyUrl" target="_blank">
        Create new
      </a>
      -
      <a v-if="!hasLinks" :href="searchPublicBodyUrl" target="_blank">
        Search
      </a>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'GeoMatcherRow',
  props: {
    georegion: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    links() {
      if (!this.georegion.links) {
        return []
      }
      return this.georegion.links.map(this.addPublicBodyAdminUrl)
    },
    matches() {
      if (!this.georegion.matches) {
        return []
      }
      return this.georegion.matches.map(this.addPublicBodyAdminUrl)
    },
    hasLinks() {
      if (!this.georegion.links) {
        return false
      }
      return this.georegion.links.length > 0
    },
    hasMatches() {
      if (this.hasLinks) {
        return false
      }
      if (!this.georegion.matches) {
        return true
      }
      return this.georegion.matches.length > 0
    },
    georegionAdminUrl() {
      return this.$root.config.url.georegionAdminUrl.replace(
        /\/0\//,
        `/${this.georegion.id}/`
      )
    },
    createPublicBodyUrl() {
      const name = window.encodeURIComponent(
        `${this.georegion.kind_detail} ${this.georegion.name}`
      )
      return `${this.$root.config.url.publicbodyAddAdminUrl}?regions=${this.georegion.id}&name=${name}`
    },
    searchPublicBodyUrl() {
      const name = window.encodeURIComponent(this.georegion.name)
      return `${this.$root.config.url.publicbodyAdminUrl}?q=${name}`
    }
  },
  mounted() {},
  methods: {
    addPublicBodyAdminUrl(pb) {
      pb.url = this.$root.config.url.publicbodyAdminChangeUrl.replace(
        /\/0\//,
        `/${pb.id}/`
      )
      return pb
    },
    connect(match) {
      this.$emit('connectpublicbody', {
        georegionId: this.georegion.id,
        georegionUrl: this.georegion.resource_uri,
        publicbodyId: match.id,
        publicbody: match
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  background-color: lightgray;
}
</style>
