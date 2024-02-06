import * as React from 'react';

import {
  AnErrorOccurred,
  CheckPagePermissions,
  LoadingIndicatorPage,
  useAPIErrorHandler,
  useNotification,
} from '@strapi/helper-plugin';
import { useParams } from 'react-router-dom';

import { useTypedSelector } from '../../core/store/hooks';
import { ConfigurationForm, ConfigurationFormProps } from '../components/ConfigurationForm/Form';
import { ComponentsDictionary, extractContentTypeComponents } from '../hooks/useDocument';
import {
  DEFAULT_SETTINGS,
  EditLayout,
  convertEditLayoutToFieldLayouts,
} from '../hooks/useDocumentLayout';
import { useGetComponentConfigurationQuery } from '../services/components';
import { useGetInitialDataQuery } from '../services/init';

import type { Contracts } from '@strapi/plugin-content-manager/_internal/shared';

/* -------------------------------------------------------------------------------------------------
 * ComponentConfigurationPage
 * -----------------------------------------------------------------------------------------------*/

const ComponentConfigurationPage = () => {
  /**
   * useDocumentLayout only works for documents, not components,
   * it feels weird to make that hook work for both when this is SUCH
   * a unique use case and we only do it here, so in short, we essentially
   * just extracted the logic to make an edit view layout and reproduced it here.
   */
  const { slug: model } = useParams<{ slug: string }>();
  const toggleNotification = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();

  const {
    components,
    schema,
    error: errorSchema,
    isLoading: isLoadingSchema,
    isFetching: isFetchingSchema,
  } = useGetInitialDataQuery(undefined, {
    selectFromResult: (res) => {
      const schema = res.data?.components.find((ct) => ct.uid === model);

      const componentsByKey = res.data?.components.reduce<ComponentsDictionary>(
        (acc, component) => {
          acc[component.uid] = component;

          return acc;
        },
        {}
      );

      const components = extractContentTypeComponents(schema?.attributes, componentsByKey);

      return {
        isFetching: res.isFetching,
        isLoading: res.isLoading,
        error: res.error,
        components,
        schema,
      };
    },
  });

  React.useEffect(() => {
    if (errorSchema) {
      toggleNotification({
        type: 'warning',
        message: formatAPIError(errorSchema),
      });
    }
  }, [errorSchema, formatAPIError, toggleNotification]);

  const {
    data,
    isLoading: isLoadingConfig,
    isFetching: isFetchingConfig,
    error,
  } = useGetComponentConfigurationQuery(model ?? '');

  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: 'warning',
        message: formatAPIError(error),
      });
    }
  }, [error, formatAPIError, toggleNotification]);

  /**
   * you **must** check if we're loading or fetching in case the component gets new props
   * but nothing was unmounted, it then becomes a fetch, not a load.
   */
  const isLoading = isLoadingConfig || isLoadingSchema || isFetchingConfig || isFetchingSchema;

  const editLayout = React.useMemo(
    () =>
      data && !isLoading
        ? formatEditLayout(data, { schema, components })
        : ({
            layout: [],
            components: {},
            settings: DEFAULT_SETTINGS,
          } as EditLayout),
    [data, isLoading, schema, components]
  );

  const handleSubmit: ConfigurationFormProps['onSubmit'] = () => {
    console.log('submit me!');
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  if (error || errorSchema || !schema) {
    return <AnErrorOccurred />;
  }

  return (
    <ConfigurationForm onSubmit={handleSubmit} attributes={schema.attributes} layout={editLayout} />
  );
};

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

const formatEditLayout = (
  data: Contracts.Components.FindComponentConfiguration.Response['data'],
  {
    schema,
    components,
  }: { schema?: Contracts.Components.Component; components: ComponentsDictionary }
) => {
  const editAttributes = convertEditLayoutToFieldLayouts(
    data.component.layouts.edit,
    schema?.attributes,
    data.component.metadatas,
    data.components
  );

  const componentEditAttributes = Object.entries(data.components).reduce<EditLayout['components']>(
    (acc, [uid, configuration]) => {
      acc[uid] = {
        layout: convertEditLayoutToFieldLayouts(
          configuration.layouts.edit,
          components[uid].attributes,
          configuration.metadatas
        ),
        settings: {
          ...configuration.settings,
          icon: components[uid].info.icon,
          displayName: components[uid].info.displayName,
        },
      };
      return acc;
    },
    {}
  );

  const editMetadatas = Object.entries(data.component.metadatas).reduce<EditLayout['metadatas']>(
    (acc, [attribute, metadata]) => {
      return {
        ...acc,
        [attribute]: metadata.edit,
      };
    },
    {}
  );

  return {
    layout: [editAttributes],
    components: componentEditAttributes,
    metadatas: editMetadatas,
    settings: {
      ...data.component.settings,
      displayName: schema?.info.displayName,
    },
  };
};

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

const ProtectedComponentConfigurationPage = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.contentManager?.componentsConfigurations
  );

  return (
    <CheckPagePermissions permissions={permissions}>
      <ComponentConfigurationPage />
    </CheckPagePermissions>
  );
};

export { ComponentConfigurationPage, ProtectedComponentConfigurationPage };
