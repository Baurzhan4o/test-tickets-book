<template>
  <v-dialog v-model="visible" @click:outside="closeDialog" width="60%">
    <v-card>
      <v-card-title>
        {{movie.name}}
        <v-btn absolute right fab text @click="closeDialog">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider/>
      <v-card-text>
        <v-row class="mt-5">
          <v-col cols="3">
            <h3>Выберите дату:</h3>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="pickedDate"
                  solo
                  class="mt-2"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="pickedDate"
                :allowed-dates="allowedDates"
                @input="handleDatePicked"
              ></v-date-picker>
            </v-menu>
            <v-chip-group
              active-class="picked"
              column
              v-model="pickedTime"
              @change="getFreeSpace"
            >
              <v-chip v-for="(time, index) in availableTime" :key="index">
                {{time}}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="9">
            <h3 v-if="freeSpace.length">Выберите место</h3>
            <div v-for="section in freeSpace" :key="section.row" class="d-flex flex-nowrap">
              <div v-for="col in section.seats" :key="col.seat"
                   :class="checkSeat(section.row, col)"
                   class="seats"
                   @click="pickSeat($event, section.row, col.seat, col.is_free)"
                   ></div>
            </div>
          </v-col>

        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row justify="end" class="mb-4 mr-4 mt-4">
          <v-btn
            @click="buyTickets"
            :loading="loading"
          >Купить</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-snackbar absolute right top color="success" v-model="showSnackbar">
      Ваш билет {{ticketId}} успешно куплен!
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  name: 'BookDialog',
  props: {
    movie: {
      default: () => {},
      type: Object,
    },
    visible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      freeSpace: [],
      sessions: [],
      pickedDate: null,
      pickedTime: null,
      menu: null,
      row: null,
      seat: null,
      loading: false,
      ticketId: null,
      showSnackbar: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.fetchSessions();
      }
    },
  },
  created() {

  },
  computed: {
    availableTime() {
      const session = this.sessions.find((i) => i.showdate === this.pickedDate);
      if (session) {
        return session.daytime.split(';');
      }
      return [];
    },
  },
  methods: {
    closeDialog() {
      this.freeSpace = [];
      this.pickedDate = null;
      this.pickedTime = null;
      this.row = null;
      this.seat = null;
      this.$emit('closed');
    },
    fetchSessions() {
      fetch(`https://cinema-api-test.y-media.io/v1/movieShows?movie_id=${this.movie.id}`)
        .then((res) => res.json())
        .then((res) => {
          this.sessions = [...res.data[this.movie.id]];
        });
    },
    allowedDates(val) {
      const dates = this.sessions.map((i) => i.showdate);
      return dates.includes(val);
    },
    handleDatePicked() {
      this.menu = false;
    },
    getFreeSpace() {
      const { id } = this.movie;
      const daytime = this.pickedTime;
      const showdate = this.pickedDate;
      fetch(`https://cinema-api-test.y-media.io/v1/showPlaces?movie_id=${id}&daytime=${daytime}&showdate=${showdate}`)
        .then((res) => res.json())
        .then((res) => {
          this.freeSpace = this.prepareSeats(res.data);
        });
    },
    prepareSeats(data) {
      return data.map((i) => ({
        row: i[0].row,
        seats: i[1],
      }));
    },
    pickSeat(event, row, seat, isFree) {
      if (isFree) {
        if (this.row === row && this.seat === seat) {
          this.row = null;
          this.seat = null;
        } else {
          this.row = row;
          this.seat = seat;
        }
      }
    },
    buyTickets() {
      this.loading = true;
      const body = {
        movie_id: this.movie.id,
        row: this.row,
        seat: this.seat,
        showdate: this.pickedDate,
        daytime: this.pickedTime,
      };
      fetch('https://cinema-api-test.y-media.io/v1/bookPlace', {
        method: 'POST',
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          this.ticketId = res.data.ticketkey;
          this.showSnackbar = true;
          this.getFreeSpace();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // eslint-disable-next-line camelcase
    checkSeat(row, { seat, is_free }) {
      // eslint-disable-next-line camelcase
      if (!is_free) return 'seats__blocked';
      if (row === this.row && seat === this.seat) return 'seats__picked';
      return '';
    },
  },
};
</script>

<style scoped lang="scss">
.picked {
  background-color: #ef6524;
  color: #fff
}

.seats {
  height: 20px;
  width: 50px;
  background-color: grey;
  margin: 2px;

    &__blocked {
     background-color: #ef6524 !important;
    }

    &__picked {
      background-color: cyan !important;
    }

}

</style>
