<template>
  <v-card title="Objectives">
    <template v-slot:prepend>
      <v-icon class="title-icon" color="secondary">mdi-calendar-check</v-icon>
    </template>
    <template v-slot:append>
      <v-progress-circular
        v-if="objectives.length > 0"
        v-model="progress"
        class="me-2"
        :color="progress == 100 ? 'green' : 'primary'"
      ></v-progress-circular>
    </template>
    <v-container style="max-width: 500px">
      <v-text-field
        v-model="newTask"
        label="Add new objective"
        variant="solo"
        @keydown.enter="createObjective"
      >
        <template v-slot:append>
          <v-fade-transition>
            <v-icon v-if="newTask" @click="createObjective">
              mdi-plus-circle
            </v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>

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
                  :color="(objective.done && 'green') || 'primary'"
                  hideDetails
                >
                  <template v-slot:label>
                    <div
                      :class="
                        (objective.done &&
                          'text-decoration-line-through text-green') ||
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
                    @click="deleteObjective(objective.id)"
                    >mdi-delete</v-icon
                  >
                  <v-icon v-else color="green">mdi-medal</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </template>
        </v-slide-y-transition>
      </v-card>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStoreUser } from "@/stores/storeUser";

const storeUser = useStoreUser();

const objectives = computed(() => {
  return Object.values(storeUser.objectives);
});
const newTask = ref(null);

const completedTasks = computed(() => {
  return objectives.value.filter((objective) => objective.done).length;
});

const progress = computed(() => {
  return (completedTasks.value / objectives.value.length) * 100;
});

function createObjective() {
  storeUser.addObjective({
    id: uuidv4(),
    objective: {
      done: false,
      text: newTask.value,
    },
  });
  newTask.value = null;
}

function deleteObjective(id) {
  console.log('delete', id);
  storeUser.deleteObjective(id);
}
</script>
