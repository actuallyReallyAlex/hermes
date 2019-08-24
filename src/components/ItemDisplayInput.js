import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button } from 'grommet'
import { Add } from 'grommet-icons'
import { connect } from 'react-redux'
import { storeCargo } from '../redux/actions/ship'
import { removeItem } from '../redux/actions/world'

const ItemDisplayInput = ({
  handleStoreCargo,
  item,
  shipCargoVolumeRemaining
}) => {
  const { id, quantity } = item

  const [value, setValue] = useState(0)

  return (
    <Box gap="small" pad="medium">
      <Button
        data-testid={`add-button-${id}`}
        disabled={shipCargoVolumeRemaining === 0 || value === 0}
        hoverIndicator
        icon={<Add />}
        onClick={() => handleStoreCargo(item, value)}
        plain
      />
      <label htmlFor={`quantity-input-${id}`}>Quantity to Add</label>
      <input
        id={`quantity-input-${id}`}
        max={
          shipCargoVolumeRemaining > quantity
            ? quantity
            : shipCargoVolumeRemaining
        }
        min={0}
        onChange={e => setValue(Number(e.target.value))}
        type="number"
        value={value}
      />
    </Box>
  )
}

ItemDisplayInput.propTypes = {
  handleStoreCargo: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  shipCargoVolumeRemaining: PropTypes.number.isRequired
}

const mapStateToProps = ({ ship }) => ({
  shipCargoVolumeRemaining: ship.cargo.volumeRemaining
})

const mapDispatchToProps = dispatch => ({
  handleStoreCargo: (item, quantity) => {
    // * dispatch an action to store the item in ship cargo
    dispatch(storeCargo(item, quantity))
    // * dispatch an action to remove the item from the list of stored items on this planet
    dispatch(removeItem(item, quantity))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemDisplayInput)