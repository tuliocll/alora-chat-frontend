import { toast } from 'react-toastify';
import { put, takeLatest } from 'redux-saga/effects';

import constants from 'modules/constants';
import { sendRequest } from 'modules/utils';
import * as contactActions from 'redux/actions/contact';
import {
  POST_ADD_CONTACT,
  GET_CONTACTS,
  DELETE_CONTACT,
} from 'redux/constants/contact';

function* addContactPostFetch(props) {
  const { params } = props;

  const { body } = params;

  const successMessages = {};

  try {
    const response = yield sendRequest({
      url: `${process.env.REACT_APP_URL}${constants.API.ACTIONS.CONTACT}`,
      method: constants.API.METHODS.POST,
      body,
    });

    if (response.success) {
      successMessages.email =
        constants.LABELS.CONTACT.CONTACT_SUCCESSFULLY_ADDED;
    }

    yield put(
      contactActions.postAddContactReceived({
        errors: response.errors,
        successMessages,
      })
    );
  } catch (e) {
    console.log(e);
    yield put(contactActions.postAddContactReceived());
    toast.error(constants.LABELS.MAIN.GLOBAL_ERROR);
  }
}

function* getContactsGetFetch() {
  try {
    const response = yield sendRequest({
      url: `${process.env.REACT_APP_URL}${constants.API.ACTIONS.CONTACT}`,
      method: constants.API.METHODS.GET,
    });

    yield put(
      contactActions.getContactsReceived({
        result: response.result,
      })
    );
  } catch (e) {
    console.log(e);
    yield put(contactActions.getContactsReceived());
    toast.error(constants.LABELS.MAIN.GLOBAL_ERROR);
  }
}

function* deleteContactFetchSaga(action) {
  const { contactId } = action.params;

  const body = {
    contactId,
  };

  try {
    yield sendRequest({
      url: `${process.env.REACT_APP_URL}${constants.API.ACTIONS.CONTACT}`,
      method: constants.API.METHODS.DELETE,
      body,
    });

    yield put(
      contactActions.removeContact({
        contactId,
      })
    );
    yield put(contactActions.deleteContactReceived());
  } catch (e) {
    console.log(e);
    yield put(contactActions.deleteContactReceived());
    toast.error(constants.LABELS.MAIN.GLOBAL_ERROR);
  }
}

const sagas = [
  takeLatest(POST_ADD_CONTACT, addContactPostFetch),
  takeLatest(GET_CONTACTS, getContactsGetFetch),
  takeLatest(DELETE_CONTACT, deleteContactFetchSaga),
];

export default sagas;
