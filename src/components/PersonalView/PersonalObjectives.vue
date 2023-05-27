<template>
  <v-card title="Objectives">
    <template v-slot:prepend>
      <v-progress-circular
        v-if="objectives.length > 0"
        v-model="progress"
        class="me-2"
        :color="progress == 100 ? 'secondary' : 'primary'"
      ></v-progress-circular>
    </template>
    <template v-slot:append>
      <v-btn icon flat size="35">
        <v-icon size="small">mdi-plus</v-icon>
        <AddObjective />
      </v-btn>
    </template>

    <v-card v-if="objectives.length > 0">
      <v-slide-y-transition class="py-0" group tag="v-list">
        <template
          v-for="(objective, i) in objectives"
          :key="`${i}-${objective.text}`"
        >
          <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="objective.done"
                :color="(objective.done && 'secondary') || 'primary'"
                hideDetails
                @click="updateObjective(i)"
              >
                <template v-slot:label>
                  <div
                    :class="
                      (objective.done &&
                        'text-decoration-line-through text-secondary') ||
                      'text-primary'
                    "
                    class="ms-4"
                    v-text="objective.text"
                  ></div>
                </template>
              </v-checkbox>
            </v-list-item-action>
            <template v-slot:append>
              <v-btn size="small" icon flat>
                <v-icon
                  v-if="!objective.done"
                  color="red"
                  @click="deleteObjective(i)"
                  >mdi-delete</v-icon
                >
                <v-icon v-else color="secondary">mdi-medal</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-slide-y-transition>
    </v-card>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useStoreUser } from "@/stores/storeUser";
import AddObjective from "@/components/PersonalView/pop-ups/AddObjective.vue";

const storeUser = useStoreUser();

const objectives = computed(() => {
  return Object.values(storeUser.objectives);
});

const completedTasks = computed(() => {
  return objectives.value.filter((objective) => objective.done).length;
});

const progress = computed(() => {
  return (completedTasks.value / objectives.value.length) * 100;
});

function deleteObjective(i) {
  storeUser.deleteObjective(Object.keys(storeUser.objectives)[i]);
}

function updateObjective(i) {
  storeUser.updateObjective(Object.keys(storeUser.objectives)[i]);
}
</script>
