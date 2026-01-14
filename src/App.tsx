import { Suspense, useEffect } from 'react'
import { languageLoad } from './redux/reducers/Language'
import { useAppDispatch } from './redux/store'

// ** Router Import
import Router from './router/Router'
import { loadLanguageList } from './utility/apis/ExportLanguage'
import { UserType } from './utility/Const'
import { log } from './utility/helpers/common'
import useUser from './utility/hooks/useUser'
import useUserType from './utility/hooks/useUserType'

const App = () => {
  // const [load, setLoad] = useState(false)
  const dispatch = useAppDispatch()
  const userType = useUserType()
  const user = useUser()

  const loadLanguageListData = () => {
    if (userType && user) {
      loadLanguageList({
        id: user?.store_id,
        jsonData: {
          store:
            userType === UserType.Store ||
            (userType === UserType?.Employee && user?.store_id !== UserType.Admin)
        },
        // loading: setLoad,
        success: (e) => {
          if (
            userType === UserType.Store ||
            (userType === UserType?.Employee && user?.store_id !== UserType.Admin)
          ) {
            log(e)
            dispatch(languageLoad(e?.payload))
          } else {
            dispatch(languageLoad(e?.payload?.data))
          }
        }
      })
    }
  }

  useEffect(() => {
    loadLanguageListData()
  }, [userType, user])

  return (
    <>
      <Suspense fallback={null}>
        <Router />
      </Suspense>
    </>
  )
}

export default App
