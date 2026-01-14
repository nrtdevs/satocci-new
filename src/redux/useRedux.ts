import { useAppDispatch, useAppSelector } from './store'
/**
 * Custom redux hook
 * @returns method to dispatch and redux states
 */
const UseRedux = () => {
  const dispatch = useAppDispatch()
  const reduxStates = useAppSelector((s) => s)
  return {
    dispatch,
    state: reduxStates
  }
}
export const useRedux = UseRedux
