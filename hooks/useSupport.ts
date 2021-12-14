import {
  FirestoreCollection,
  RestaurantSupportRequest,
  SupportMessage,
  SupportMessageDirection,
} from '@tastiest-io/tastiest-utils';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { v4 as uuid } from 'uuid';
import { IState } from '../state/reducers';
import { useAuth } from './useAuth';
import { useRestaurantData } from './useRestaurantData';

export enum SupportRequestGenerationError {
  NO_NAME = 'NO_NAME',
  NO_EMAIL = 'NO_EMAIL',
  NO_SUBJECT = 'NO_SUBJECT',
  NO_MESSAGE = 'NO_MESSAGE',
  NOT_SIGNED_IN = 'NOT_SIGNED_IN',
  FIRESTORE_ERROR = 'FIRESTORE_ERROR',
}

type MappedSupportRequest = Partial<RestaurantSupportRequest> & { id: string };

export function useSupport() {
  const { restaurantUser, isSignedIn } = useAuth();
  const { restaurantData } = useRestaurantData(restaurantUser);
  const firestore = useFirestore();

  useFirestoreConnect([
    {
      collection: FirestoreCollection.SUPPORT_RESTAURANTS,
    },
  ]);

  const supportRequestEntries: Partial<
    RestaurantSupportRequest
  >[] = useSelector(
    ({ firestore: { data } }: IState) =>
      data?.[FirestoreCollection.SUPPORT_RESTAURANTS],
  );

  const supportRequests: MappedSupportRequest[] = Object.entries(
    supportRequestEntries ?? {},
  )
    .map(([id, supportRequest]) => {
      return { id, ...supportRequest };
    })
    .filter(r => r.restaurantId === restaurantData.details.id);

  const makeSupportRequest = async (
    name: string,
    subject: string,
    message: string,
  ): Promise<{
    success: boolean;
    data: { id: string } | null;
    errors: SupportRequestGenerationError[];
  }> => {
    const errors: SupportRequestGenerationError[] = [];

    if (!isSignedIn) errors.push(SupportRequestGenerationError.NOT_SIGNED_IN);
    if (!name?.length) errors.push(SupportRequestGenerationError.NO_NAME);
    if (!subject?.length) errors.push(SupportRequestGenerationError.NO_SUBJECT);
    if (!message?.length) errors.push(SupportRequestGenerationError.NO_MESSAGE);

    if (errors.length) {
      return { success: false, data: null, errors };
    }

    const initialMessage: SupportMessage = {
      name,
      message,
      timestamp: Date.now(),
      direction: SupportMessageDirection.RESTAURANT_TO_SUPPORT,
      hasOpened: false,
      recipientHasOpened: false,
    };

    const requestId = uuid();
    const supportRequest: RestaurantSupportRequest = {
      id: requestId,
      restaurantId: restaurantUser.uid,
      email: restaurantUser.email,
      name,
      subject,
      conversation: [initialMessage],
      // TODO POST MVP: MAKE THE FOLLOWING FILL OUT WITH A FIREBASE
      // FUNCTION --> for security
      seen: false,
      resolved: false,
      priority: 'normal',
      createdAt: Date.now(),
      updatedAt: null,
    };

    window.analytics.track('Restaurant Support Request', {
      userId: restaurantUser.uid,
      properties: {
        supportRequest,
        restaurantDetails: restaurantData.details,
        dateOfRequest: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
      },
    });

    try {
      await firestore
        .collection(FirestoreCollection.SUPPORT_RESTAURANTS)
        .doc(requestId)
        .set(supportRequest);

      return { success: true, data: { id: requestId }, errors: [] };
    } catch {
      return {
        success: false,
        data: null,
        errors: [SupportRequestGenerationError.FIRESTORE_ERROR],
      };
    }
  };

  return { supportRequests, makeSupportRequest };
}
