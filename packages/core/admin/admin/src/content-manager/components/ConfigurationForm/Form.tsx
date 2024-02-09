import * as React from 'react';

import {
  Button,
  ContentLayout,
  Divider,
  Flex,
  Grid,
  GridItem,
  HeaderLayout,
  Layout,
  Main,
  Typography,
} from '@strapi/design-system';
import { Link } from '@strapi/design-system/v2';
import { ArrowLeft } from '@strapi/icons';
import pipe from 'lodash/fp/pipe';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { capitalise } from '../../../utils/strings';
import { ATTRIBUTE_TYPES_THAT_CANNOT_BE_MAIN_FIELD } from '../../constants/attributes';
import { getTranslation } from '../../utils/translations';
import { Form, FormProps, useForm } from '../Form';
import { InputRenderer } from '../FormInputs/Renderer';

import { Fields, FieldsProps, TEMP_FIELD_NAME } from './Fields';

import type { EditFieldLayout, EditLayout } from '../../hooks/useDocumentLayout';

/* -------------------------------------------------------------------------------------------------
 * ConfigurationForm
 * -----------------------------------------------------------------------------------------------*/

interface ConfigurationFormProps extends Pick<FieldsProps, 'attributes'> {
  layout: EditLayout;
  onSubmit: FormProps<ConfigurationFormData>['onSubmit'];
}

/**
 * Every key in EditFieldLayout is turned to optional never and then we overwrite the ones we are using.
 */

type EditFieldSpacerLayout = {
  [key in keyof Omit<EditFieldLayout, 'name' | 'size'>]?: never;
} & {
  description?: never;
  editable?: never;
  name: '_TEMP_';
  size: number;
};

interface ConfigurationFormData extends Pick<EditLayout, 'settings'> {
  layout: Array<
    Array<
      | (Pick<EditFieldLayout, 'label' | 'size' | 'name' | 'placeholder' | 'mainField'> & {
          description: EditFieldLayout['hint'];
          editable: EditFieldLayout['disabled'];
        })
      | EditFieldSpacerLayout
    >
  >;
}

const ConfigurationForm = ({
  attributes,
  layout: editLayout,
  onSubmit,
}: ConfigurationFormProps) => {
  const { components, settings, layout, metadatas } = editLayout;

  const { formatMessage } = useIntl();

  const initialValues: ConfigurationFormData = React.useMemo(() => {
    const transformations = pipe(flattenPanels, extractMetadata, addTmpSpaceToLayout);

    return {
      layout: transformations(layout),
      settings,
    };
  }, [layout, settings]);

  return (
    <Layout>
      <Main>
        <Form initialValues={initialValues} onSubmit={onSubmit} method="PUT">
          <Header name={settings.displayName ?? ''} />
          <ContentLayout>
            <Flex
              alignItems="stretch"
              background="neutral0"
              direction="column"
              gap={6}
              hasRadius
              shadow="tableShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Typography variant="delta" as="h2">
                {formatMessage({
                  id: getTranslation('containers.SettingPage.settings'),
                  defaultMessage: 'Settings',
                })}
              </Typography>
              <Grid>
                <GridItem col={6} s={12}>
                  <InputRenderer
                    type="enumeration"
                    label={formatMessage({
                      id: getTranslation('containers.SettingPage.editSettings.entry.title'),
                      defaultMessage: 'Entry title',
                    })}
                    hint={formatMessage({
                      id: getTranslation(
                        'containers.SettingPage.editSettings.entry.title.description'
                      ),
                      defaultMessage: 'Set the display field of your entry',
                    })}
                    name="settings.mainField"
                    options={Object.entries(attributes).reduce<
                      Array<{ label: string; value: string }>
                    >((acc, [key, attribute]) => {
                      if (!attribute) {
                        return acc;
                      }

                      /**
                       * Create the list of attributes from the schema as to which can
                       * be our `mainField` and dictate the display name of the schema
                       * we're editing.
                       */
                      if (!ATTRIBUTE_TYPES_THAT_CANNOT_BE_MAIN_FIELD.includes(attribute.type)) {
                        acc.push({
                          label: key,
                          value: key,
                        });
                      }

                      return acc;
                    }, [])}
                  />
                </GridItem>
                <GridItem paddingTop={6} paddingBottom={6} col={12} s={12}>
                  <Divider />
                </GridItem>
                <GridItem col={12} s={12}>
                  <Typography variant="delta" as="h3">
                    {formatMessage({
                      id: getTranslation('containers.SettingPage.view'),
                      defaultMessage: 'View',
                    })}
                  </Typography>
                </GridItem>
                <GridItem col={12} s={12}>
                  <Fields attributes={attributes} components={components} metadatas={metadatas} />
                </GridItem>
              </Grid>
            </Flex>
          </ContentLayout>
        </Form>
      </Main>
    </Layout>
  );
};

/**
 * @internal
 * @description Each row of the layout has a max size of 12 (based on bootstrap grid system)
 * So in order to offer a better drop zone we add the _TEMP_ div to complete the remaining substract (12 - existing)
 */
const addTmpSpaceToLayout = (
  layout: Exclude<ConfigurationFormData['layout'], { name: '_TEMP_' }>
): ConfigurationFormData['layout'] =>
  layout.map((row) => {
    const totalSpaceTaken = row.reduce((acc, field) => acc + field.size, 0);

    if (totalSpaceTaken < 12) {
      return [
        ...row,
        {
          name: TEMP_FIELD_NAME,
          size: 12 - totalSpaceTaken,
        } satisfies EditFieldSpacerLayout,
      ];
    }

    return row;
  });

/**
 * @internal
 * @description Panels don't exist in the layout, so we flatten by one.
 */
const flattenPanels = (layout: EditLayout['layout']): EditLayout['layout'][number] =>
  layout.flat(1);

/**
 * @internal
 * @description We extract the metadata values from the field layout, because these are editable by the user.
 */
const extractMetadata = (
  layout: EditLayout['layout'][number]
): Exclude<ConfigurationFormData['layout'], { name: '_TEMP_' }> => {
  return layout.map((row) =>
    row.map(({ label, disabled, hint, placeholder, size, name, mainField }) => ({
      label,
      editable: !disabled,
      description: hint,
      mainField,
      placeholder,
      size,
      name,
    }))
  );
};

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  const { formatMessage } = useIntl();
  const modified = useForm('Header', (state) => state.modified);
  const isSubmitting = useForm('Header', (state) => state.isSubmitting);

  return (
    <HeaderLayout
      title={formatMessage(
        {
          id: getTranslation('components.SettingsViewWrapper.pluginHeader.title'),
          defaultMessage: `Configure the view - {name}`,
        },
        { name: capitalise(name) }
      )}
      subtitle={formatMessage({
        id: getTranslation('components.SettingsViewWrapper.pluginHeader.description.edit-settings'),
        defaultMessage: 'Customize how the edit view will look like.',
      })}
      navigationAction={
        // @ts-expect-error – DS does not infer props from the `as` prop
        <Link startIcon={<ArrowLeft />} as={NavLink} to="..">
          {formatMessage({
            id: 'global.back',
            defaultMessage: 'Back',
          })}
        </Link>
      }
      primaryAction={
        <Button disabled={!modified} loading={isSubmitting} type="submit">
          {formatMessage({ id: 'global.save', defaultMessage: 'Save' })}
        </Button>
      }
    />
  );
};

export { ConfigurationForm };
export type { ConfigurationFormProps, ConfigurationFormData };
