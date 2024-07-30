<template>
    <v-sheet
      class="mx-auto"
      elevation="8"
      max-width="100"
    >
      <v-slide-group
        v-model="props.outfits"
        class="pa-4"
        show-arrows
      >
        <v-slide-group-item
          v-for="outfit in props.outfits"
          :key="outfit"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <Outfit :outfit="outfit"></Outfit>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </template>