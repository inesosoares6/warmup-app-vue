<template>
  <v-dialog v-model="previewRecords" activator="parent">
    <v-card title="Select Personal Record">
      <template v-slot:append>
        <v-checkbox
          v-model="selectedAll"
          hide-details
          @change="updateListAll()"
        ></v-checkbox>
      </template>
      <v-card-text>
        <v-list class="preview-wod-list" v-if="personalRecords.length > 0">
          <v-list-item
            v-for="(record, index) in personalRecords"
            :key="record.id"
            :title="record.name + ': ' + record.value"
          >
            <template v-slot:prepend>
              <v-avatar size="25" color="secondary">
                <v-icon size="small">mdi-check</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-checkbox
                v-model="selected[index]"
                hide-details
                @change="updateList(selected[index], record)"
              ></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          :disabled="personalRecordsList.length < 1"
          @click="deletePRs"
        >
          Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PreviewRecords",
  props: ["personalRecords"],

  created() {
    this.updateCheckboxes(false);
  },

  data() {
    return {
      previewRecords: false,
      selected: [],
      selectedAll: false,
      personalRecordsList: [],
    };
  },

  methods: {
    deletePRs() {
      this.$emit("delete-personal-records", this.personalRecordsList);
      this.previewList = false;
    },

    updateCheckboxes(value) {
      this.selected = new Array(this.personalRecords.length).fill(value);
    },

    updateList(insert, newPR) {
      if (insert !== false) {
        this.personalRecordsList = [...this.personalRecordsList, newPR];
        if (this.selected.every((v) => v === true)) {
          this.selectedAll = true;
        }
      } else {
        this.personalRecordsList = this.personalRecordsList.filter(
          (record) => record.id !== newPR.id
        );
        this.selectedAll = false;
      }
    },

    updateListAll() {
      this.updateCheckboxes(this.selectedAll);
      this.personalRecordsList = this.selectedAll
        ? [...this.personalRecords]
        : [];
    },
  },
});
</script>

<style scoped>
.preview-wod-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
