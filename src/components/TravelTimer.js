import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Box, Heading } from 'grommet'
import { addCash } from '../redux/actions/user'
import {
  removeCargo,
  setShipLocation,
  setDestination,
  setShipTraveling
} from '../redux/actions/ship'
import moment from 'moment'

const TravelTimer = ({ handleTimerStopped, ship }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  const timerLogic = () => {
    if (ship.isShipTraveling) {
      const travelTimer = setInterval(() => {
        const now = moment()
        now.millisecond(0)
        const differenceMill = moment(ship.destination.eta, 'x').diff(now)

        const diffDuration = moment.duration({ milliseconds: differenceMill })

        diffDuration.subtract(1, 'second')

        if (diffDuration.asMilliseconds() === 0) {
          clearInterval(travelTimer)
          handleTimerStopped(ship)
        }

        setTimeLeft(diffDuration)
      }, 1000)
    }
  }

  useEffect(timerLogic, [ship.isShipTraveling])

  return ship.isShipTraveling ? (
    <Box>
      <Heading level="3">Travel Timer</Heading>
      {timeLeft && (
        <span>
          {timeLeft.minutes()} minutes {timeLeft.seconds()} seconds
        </span>
      )}
    </Box>
  ) : null
}

TravelTimer.propTypes = {
  handleTimerStopped: PropTypes.func.isRequired,
  ship: PropTypes.object.isRequired
}

const mapStateToProps = ({ ship }) => ({ ship })

const mapDispatchToProps = dispatch => ({
  handleTimerStopped: ship => {
    const { cargo, destination } = ship
    const sellableItems = cargo.items.filter(
      item => item.destination.value === destination.value
    )
    let profit = 0
    sellableItems.forEach(item => {
      const { quantity, value } = item
      const itemProfit = quantity * value
      profit += itemProfit
    })
    dispatch(addCash(profit))
    sellableItems.forEach(item => {
      dispatch(removeCargo(item))
    })
    dispatch(
      setShipLocation({ name: destination.name, value: destination.value })
    )
    dispatch(setDestination(null))
    dispatch(setShipTraveling(false))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelTimer)
