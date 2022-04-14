export default {
    requests(state, _, _2, rootGetter){
        const coachId = rootGetter.userId
        return state.requests.filter(req => req.coachId === coachId)
    },
    hasRequests(_, getters){
        return getters.requests.length > 0
    }
}