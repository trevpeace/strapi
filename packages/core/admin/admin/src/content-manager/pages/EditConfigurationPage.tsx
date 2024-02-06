import { AnErrorOccurred, CheckPagePermissions, LoadingIndicatorPage } from '@strapi/helper-plugin';

import { useTypedSelector } from '../../core/store/hooks';
import { ConfigurationForm, ConfigurationFormProps } from '../components/ConfigurationForm/Form';
import { useDoc } from '../hooks/useDocument';
import { useDocLayout } from '../hooks/useDocumentLayout';

const EditConfigurationPage = () => {
  const { isLoading: isLoadingSchema, schema } = useDoc();
  const { isLoading: isLoadingLayout, error, edit } = useDocLayout();

  const isLoading = isLoadingSchema || isLoadingLayout;

  const handleSubmit: ConfigurationFormProps['onSubmit'] = () => {
    console.log('submit me!');
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  if (error || !schema) {
    return <AnErrorOccurred />;
  }

  return <ConfigurationForm onSubmit={handleSubmit} attributes={schema.attributes} layout={edit} />;
};

const ProtectedEditConfigurationPage = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.contentManager?.collectionTypesConfigurations
  );

  return (
    <CheckPagePermissions permissions={permissions}>
      <EditConfigurationPage />
    </CheckPagePermissions>
  );
};

export { ProtectedEditConfigurationPage, EditConfigurationPage };
