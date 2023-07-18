import { createSlice } from '@reduxjs/toolkit'
import { getNavList, setNavList } from '@/use/index';
export const counterSlice = createSlice({
    name: 'nav',
    initialState: {
        value: getNavList()
    },
    reducers: {
        increment: (state, action) => {
            setNavList(action.payload)
            state.value = action.payload

        },
        decrement: state => {
            //   state.value -= 1
        },
        incrementByAmount: (state, action) => {
            //   state.value += action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export const selectNavList = (state: any) => state.nav.value
export default counterSlice.reducer