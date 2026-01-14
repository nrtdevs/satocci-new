/* eslint-disable prefer-const */
import { useEffect, useState } from 'react'
import GooglePlacesAutocomplete, {
  geocodeByLatLng,
  geocodeByPlaceId
} from 'react-google-places-autocomplete'
import { mapApiKey } from '../Const'
import { formatAndSetData, selectThemeColors } from '../Utils'
import { FM, isValid, log } from '../helpers/common'

export default function GoogleMaps({ center, handleAddress = (e) => {}, countryCode = (e) => {} }) {
  const [address, setAddress] = useState()
  const [addressObj, setAddressObj] = useState()
  const [lng, setLng] = useState()
  const [lat, setLat] = useState()

  const getAddressObject = (address_components) => {
    // console.log(address_components)
    const ShouldBeComponent = {
      street_number: ['street_number'],
      postal_code: ['postal_code', 'zip_code', 'postal_area'],
      street: ['street_address', 'route'],
      province: [
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5'
      ],
      city: [
        'locality',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4'
      ],
      country: ['country'],
      country_code: ['country']
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    let address = {
      street_number: '',
      postal_code: '',
      street: '',
      province: '',
      city: '',
      country: '',
      country_code: ''
    }

    address_components.forEach((component) => {
      for (const shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === 'country') {
            address[shouldBe] = component.short_name
          } else if (shouldBe === 'country_code') {
            address[shouldBe] = component.short_name
          } else {
            address[shouldBe] = component.long_name
          }
        }
      }
    })

    // Fix the shape to match our schema
    address.address = `${address.street_number} ${address.street}`
    delete address.street_number
    delete address.street
    if (address.country === 'US') {
      address.state = address.province
      delete address.province
    }
    return address
  }

  useEffect(() => {
    countryCode(addressObj?.country_code)
  }, [addressObj])

  useEffect(() => {
    const func = async () => {
      const geocodeObj =
        address && address.value && (await geocodeByPlaceId(address.value.place_id))
      const addressObject = geocodeObj && getAddressObject(geocodeObj[0].address_components)

      setAddressObj(addressObject)
    }
    func()
  }, [address])

  const geoCodeDecodeLat = (x) => {
    geocodeByLatLng(x)
      .then((results) => {
        let place = results[0]
        // log(place, 'results')
        handleAddress({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          country_code: addressObj?.country_code,
          ...formatAndSetData(place)
        })
        setAddress({
          label: place?.formatted_address,
          value: place
        })
        setLat(place.geometry.location.lat())
        setLng(place.geometry.location.lng())
      })
      .catch((error) => {
        log(error)
      })
  }

  useEffect(() => {
    if (isValid(center?.lat) && isValid(center?.lng)) {
      if (center?.lng !== lng && center?.lat !== lat) {
        geoCodeDecodeLat(center)
      }
    }
  }, [center])

  const geoCodeDecode = (place_id) => {
    geocodeByPlaceId(place_id)
      .then((results) => {
        let place = results[0]
        // log(place, 'place_id')
        handleAddress({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          country_code: addressObj?.country_code,
          ...formatAndSetData(place)
        })
        setLat(place.geometry.location.lat())
        setLng(place.geometry.location.lng())
      })
      .catch((error) => {
        log(error)
      })
  }
  return (
    <div className='App mb-2'>
      <p className='fw-bolder'>{FM('search-address')}</p>
      <GooglePlacesAutocomplete
        apiKey={mapApiKey}
        selectProps={{
          theme: selectThemeColors,
          classNamePrefix: 'select',
          isClearable: true,
          value: address,
          onChange: (d) => {
            setAddress(d)
            geoCodeDecode(d?.value?.place_id)
          }
        }}
      />
      {/*
      <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: 20 }}>
        {JSON.stringify(addressObj, 0, 2)}
      </pre>
      */}
    </div>
  )
}
