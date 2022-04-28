<template>
  <h1 v-text="'Monetization Dashboard'" />
  <el-space class="filters">
    <el-input
      v-model="game"
      @input="search"
      placeholder="Type to search a game"
    />

    <el-date-picker
      :value="dateRange"
      type="daterange"
      unlink-panels
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      :shortcuts="shortcuts"
      @calendar-change="onDateChange"
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
    />
  </el-space>

  <el-table :data="countries" v-if="!$apollo.queries.monetizations.fetching && countries && countries.length > 0">
    <el-table-column prop="code" label="country" width="180" />
    <el-table-column prop="total" label="total revenue" width="180" />
  </el-table>

  <el-table v-if="!$apollo.queries.monetizations.fetching" :data="filteredMonetizations || monetizations" border class="table">
    <el-table-column prop="game" label="game" width="180" />
    <el-table-column prop="revenue" label="revenue" sortable width="180">
      <template #default="scope">
        <span>{{ scope.row.revenue }}k</span>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="date" width="180" />
    <el-table-column prop="country" label="country" sortable width="180" />
    <el-table-column prop="format" label="format" width="180" />
  </el-table>
</template>

<script>
import monetizationsQuery from "@/graph/monetizationsQuery"
import moment from "moment"

const SHORTCUTS = [
  {
    text: "Last week",
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

export default {
  data() {
    const lastWeek = SHORTCUTS[0].value()
    const start = moment(lastWeek[0]).format("YYYY-MM-DD")
    const end = moment(lastWeek[1]).format("YYYY-MM-DD")

    return {
      monetizations: [],
      filteredMonetizations: null,
      game: null,
      dateRange: [end, start],
      shortcuts: SHORTCUTS,
    }
  },

  computed: {
    countries() {
      const { monetizations } = this

      debugger

      return [...new Set(monetizations.map((item) => item.country))].map(
        (code) => ({
          code,
          total: monetizations
            .filter((x) => x.country === code)
            .reduce((prev, curr) => {
              return prev + curr.revenue
            }, 0)
        })
      )
    },
  },

  methods: {
    search(input) {
      this.filteredMonetizations = this.monetizations.filter((m) =>
        m.game.includes(input)
      )
    },

    onDateChange(value) {
      this.dateRange = value
        .map((d) => moment(d).format("YYYY-MM-DD"))
        .reverse()
    },
  },

  apollo: {
    monetizations: {
      query: monetizationsQuery,
      variables() {
        return {
          start: this.dateRange[1],
          end: this.dateRange[0],
        }
      },
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  margin: 1em 0;
}

h3 {
  font-size: 1.2rem;
}
.filters {
  margin: 1em 0;
  display: flex;
  width: 100%;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.table {
  width: 100%;
  margin-bottom: 1em;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
