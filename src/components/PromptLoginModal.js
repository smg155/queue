import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const PromptLoginModal = props => (
  <Modal isOpen={props.isOpen}>
    <ModalHeader>Session expired</ModalHeader>
    <ModalBody>
      You&apos;ll need to log in again to continue.
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={props.confirm}>
        Log in
      </Button>
    </ModalFooter>
  </Modal>
)

PromptLoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  confirm: PropTypes.func.isRequired,
}

export default PromptLoginModal
