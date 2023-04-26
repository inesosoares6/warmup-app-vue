<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card :title="personalValue.name">
      <template v-slot:prepend>
        <v-icon v-if="input === 'measurement'" size="small" color="secondary"
          >mdi-scale-bathroom</v-icon
        >
        <v-icon v-else size="small" color="secondary"
          >mdi-clipboard-text</v-icon
        >
      </template>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="newValue"
              label="Add new value"
              type="number"
              :suffix="personalValue.unit ? personalValue.unit : 'kg'"
            ></v-text-field>
          </v-col>
          <v-col v-if="input === 'measurement'">
            <v-text-field
              v-model="newTargetValue"
              label="New target"
              :suffix="personalValue.unit"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card title="Evolution" width="85%" style="margin: auto">
        <CardGraphs
          :personalValue="personalValue"
          :input="input"
          :color="color"
        />
      </v-card>
      <v-card-actions>
        <v-btn color="error" @click="deleteRecord(true)" :disabled="!personalValue.value">
          Delete Last Entry
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="updateRecord" :disabled="!(newValue || newTargetValue)"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CardGraphs from "@/components/PersonalView/pop-ups/CardGraphs.vue";
import { useStoreUser } from "@/stores/storeUser";

const storeUser = useStoreUser();
const props = defineProps(["personalValue", "input", "color", "id"]);

onMounted(() => {
  personalValueEdited.value = { ...props.personalValue };
});

const editPersonalRecord = ref(false);
const personalValueEdited = ref({});
const newValue = ref(null);
const newTargetValue = ref(null);

const deleteRecord = (lastEntry) => {
  if (props.input === "measurement") {
    storeUser.deleteMeasurement(props.personalValue, lastEntry);
  } else {
    storeUser.deletePR(props.personalValue, lastEntry);
  }
};

const updateRecord = () => {
  if (newValue.value) {
    personalValueEdited.value.value.push(newValue.value);
    let date = new Date().toString().split(" ");
    personalValueEdited.value.date.push(
      date[2] + " " + date[1] + " " + date[3]
    );
  }
  if (newTargetValue.value)
    personalValueEdited.value.target = newTargetValue.value;
    
  storeUser.updateValue(props.input, {
    id: props.id,
    updates: personalValueEdited.value,
  });
  newValue.value = null;
  newTargetValue.value = null;
  editPersonalRecord.value = false;
};
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}

.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
</style>
