<template>
    <div>
        <base-dialog :show="!!error" title="An error occured" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                    <base-button link to="/auth/?redirect=register" v-if="!isLoggedIn">Login to register as a coach</base-button>
                    <base-button link to="/register" v-if="isLoggedIn && !isCoach && !isLoading">Register as Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner />
                </div>
                <ul v-else-if="hasCoaches">
                    <coach-item 
                        v-for="coach in filteredCoaches" 
                        :key="coach.id" 
                        :id="coach.id"
                        :firstname="coach.firstName"
                        :lastname="coach.lastName"
                        :rate="coach.hourlyRate"
                        :areas="coach.areas"
                    />
                </ul>
                <h3 v-else>No coaches found.</h3>
            </base-card>
        </section>
    </div>
</template> 

<script>
import CoachItem from '../../components/coaches/CoachItem.vue'
import CoachFilter from '../../components/coaches/CoachFilter.vue'
import BaseDialog from '../../components/ui/BaseDialog.vue'
import BaseButton from '../../components/ui/BaseButton.vue'

export default {
    components: {
        CoachItem,
        CoachFilter,
        BaseDialog,
        BaseButton,
    },
    data(){
        return {
            isLoading: false,
            error: null,
            filters: {
                frontend: true,
                backend: true,
                career: true
            }
        }
    },
    computed: {
        isLoggedIn(){
            return this.$store.getters.isAuthenticated
        },
        filteredCoaches(){
            const coaches = this.$store.getters['coaches/coaches']

            return coaches.filter(coach => {
                if(this.filters.frontend && coach.areas.includes('frontend')){
                    return true
                }
                if(this.filters.backend && coach.areas.includes('backend')){
                    return true
                }
                if(this.filters.career && coach.areas.includes('career')){
                    return true
                }

                return false
            })
        },
        hasCoaches(){
            return !this.isLoading && this.$store.getters['coaches/hasCoaches']
        },
        isCoach(){
            return this.$store.getters['coaches/isCoach']
        }
    },
    created(){
        this.loadCoaches()
    },
    methods: {
        setFilters(updatedFilters){
            this.filters = updatedFilters
        },
        async loadCoaches(refresh = false){
            this.isLoading = true
            try {
                await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: refresh })
            } catch (error) {
                this.error = error.message || 'Smth went wrong'
            }
            this.isLoading = false
        },
        handleError(){
            this.error = null
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>