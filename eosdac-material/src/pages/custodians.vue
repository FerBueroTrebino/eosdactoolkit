<template>
<q-page class="text-white q-pa-md">
<Transaction ref="Transaction" v-on:done="" />

<div class="row gutter-sm">
  <!-- first column  -->
  <div class="col-sm-12 col-md-8" >
    <div>
      <span class="q-display-1 q-mt-none ">Candidate List - {{custodians.length}}</span>
      <p class="text-dimwhite">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam libero urna, efficitur at laoreet fermentum, facilisis in ex. Proin luctus erat sem, ut mollis dui laoreet id. Curabitur eleifend ante in lacus rutrum dapibus. Nulla sit amet maximus metus, ac interdum dui. Aliquam placerat nisl eu bibendum dictum. Integer pharetra diam pretium felis venenatis, in aliquam ex imperdiet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </p>

      <div class="bg-dark2 q-pa-md q-mb-md shadow-5 round-borders" v-if="!loading">
        <q-pagination v-show="pagination.max > 1" v-model="pagination.page" :min="1" :max="pagination.max" direction-links/>
      </div>
      <Candidate 
        v-for="(candidate, index) in paginate" 
        :key="candidate.candidate_name" 
        :data="candidate" 
        @profile ="addProfile" 
        @clickvotefor="addToVoteList(candidate.candidate_name)"  
      /> 
      <div class="bg-dark2 q-pa-md shadow-5 round-borders" v-if="!loading">
        <q-pagination v-show="pagination.max > 1" v-model="pagination.page" :min="1" :max="pagination.max" direction-links/>
      </div>

    </div>
  </div>
  <!-- second column -->
  <div class="col-sm-12 col-md-4" >
    <div>
      <span class="q-display-1">My Votes - {{getSelectedCand.length}}</span>
      <p class="text-dimwhite">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam libero urna, efficitur at laoreet fermentum, facilisis in ex. Proin luctus erat sem, ut mollis dui laoreet id.</p>
      <q-card class="q-pa-lg q-mt-md" style="background:#32363F;">
        <q-btn style="font-weight: 300;" class="full-width items-baseline" color="primary" size="xl" @click="voteForCandidates">
          <div style="width:55px;display:inlineblock">
            <q-icon size="50px" class="float-left" name="icon-ui-3"></q-icon>
          </div>
          <div style="display:inline-block" >
            Submit my Votes
          </div>
        </q-btn>
        <q-list class="q-mt-md">
          <transition-group name="list" tag="p">
            <q-item class="bg-dark2" style="height:66px;margin-bottom:1px;" v-for="(cand, i) in getSelectedCand" :key="i">
              <q-item-side>
                <q-item-tile style="height:36px;width:36px;" class="q-mr-sm">
                  <img style="height:36px;width:36px;border-radius:50%;" class="q-mr-md responsive" src="https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg">
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <h6 class="q-ma-none">{{cand.candidate_name}}</h6>
              </q-item-main>
              <q-item-side right>
                <q-btn dense round color="primary" icon="icon-ui-8" @click="deleteFromVoteList(cand.candidate_name)" />
              </q-item-side>
            </q-item>
          </transition-group>
        </q-list>
        <!-- <pre>{{getSelectedCand}}</pre> -->
      </q-card>
    </div>
  </div>
</div><!-- end row -->
<LoadingSpinner :visible="loading" :text="$t('loading_candidates')" />
</q-page>
</template>

<script>
import Candidate from 'components/candidate'
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Custodians',
  components: {
    Transaction,
    Candidate,
    LoadingSpinner
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      custodians: [],
      page_content:[],
      pagination :{
        page:1,
        max:1,
        items_per_page: 9
      }
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
    }),
    getSelectedCand(){
      let selected = this.custodians.filter(x => x.selected == true);
      return selected;
    },
    paginate(){
      return this.custodians.slice((this.pagination.page-1) * this.pagination.items_per_page, this.pagination.page * this.pagination.items_per_page);
    }
  },

  created() {
    // this.getCustodians()
    this.getAllCandidates()
  },

  methods: {
    async getAllCandidates(){
      this.loading = true;
      let lb='';
      let temp = [];

      while(lb !== null){
        let c = await this.$store.dispatch('api/getCustodians', {lb: lb});
        if(c){

            if(lb === c[c.length-1].candidate_name){
              //if last received is same as start last requested
              // end loop!
              lb = null;
            }
            else{
              if(lb != ''){
                //remove first entry except for the first run
                c.shift(); 
              }
              //set lower_bound to the last received candidate_name
              lb = c[c.length-1].candidate_name; 
              temp.push(...c);
            }
        }
      }
      //sort by votes desc + add selected boolean to all candidates
      //this is less expensive compared to looping through it again.
      temp = temp.sort(function(a, b) {
          if(a.selected == undefined){
            a.selected = false;
          }
          if(b.selected == undefined){
            b.selected = false;
          }
          let t = b.total_votes - a.total_votes;
          return t;
      });
      //add selected key to all custodians
      // temp = temp.map(c => {
      //   c.selected = false;
      //   return c;
      // })
      console.log(temp)
      this.pagination.max = Math.ceil(temp.length/this.pagination.items_per_page);
      this.custodians = temp;
      this.loading = false;
    },

    async getCustodians(lb='') {
      let custodians = await this.$store.dispatch('api/getCustodians', {lb: lb})
      console.log(custodians)
      this.custodians = custodians
    },

    addToVoteList(name){
      let selected = this.custodians.filter(x => x.selected == true);
      if(selected.length < 8){
        this.custodians.find(x => x.candidate_name === name).selected =true;
      }
      else{
        console.log('reached max number of votes.')
      }
      
    },

    deleteFromVoteList(name){
      this.custodians.find(x => x.candidate_name === name).selected =false;
    },

    voteForCandidates() {
      let votes = this.custodians.filter(x => x.selected == true).map(c => c.candidate_name);
      if(!votes.length){
        console.log('Votelist can\'t be empty');
        return false;
      }
      this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name, 'votecust', {
        voter: this.getAccountName,
        newvotes: votes
      }, false, false)
    },

    addProfile(eventdata){
      this.custodians.find(x => x.candidate_name === eventdata.candidate_name).profile =eventdata.profile;
    }

  }
}
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
