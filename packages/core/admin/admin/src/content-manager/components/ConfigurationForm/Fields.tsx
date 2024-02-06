import * as React from 'react';

import { Box, Flex, Grid, GridItem, IconButton, Typography } from '@strapi/design-system';
import { Link, Menu } from '@strapi/design-system/v2';
import { Cog, Cross, Drag, Pencil, Plus } from '@strapi/icons';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { type UseDragAndDropOptions, useDragAndDrop } from '../../hooks/useDragAndDrop';
import { ItemTypes } from '../../utils/dragAndDrop';
import { useComposedRefs } from '../../utils/refs';
import { getTranslation } from '../../utils/translations';
import { ComponentIcon } from '../ComponentIcon';
import { useField, useForm } from '../Form';

import { EditFieldForm, EditFieldFormProps } from './EditFieldForm';

import type { ConfigurationFormData } from './Form';
import type { EditLayout } from '../../hooks/useDocumentLayout';

/* -------------------------------------------------------------------------------------------------
 * Fields
 * -----------------------------------------------------------------------------------------------*/

interface FieldsProps extends Pick<EditLayout, 'metadatas'>, Pick<FieldProps, 'components'> {
  attributes: {
    [key: string]: FieldProps['attribute'];
  };
  components: EditLayout['components'];
}

const Fields = ({ attributes, components, metadatas = {} }: FieldsProps) => {
  const { formatMessage } = useIntl();

  const { layout } = useForm('Fields', (state) => state.values as ConfigurationFormData);

  const existingFields = layout.flat(3).map((field) => field.name);

  /**
   * Get the fields that are not already in the layout
   * But also check that they are visible before we give users
   * the option to display them. e.g. `id` is not visible.
   */
  const remainingFields = Object.keys(attributes).filter(
    (field) => !existingFields.includes(field) && metadatas[field]?.visible === true
  );

  const handleMoveField: FieldProps['onMoveField'] = (newIndex, currentIndex) => {
    console.log(newIndex, currentIndex);
  };

  return (
    <Flex paddingTop={6} direction="column" alignItems="stretch" gap={4}>
      <Flex alignItems="flex-start" direction="column" justifyContent="space-between">
        <Typography fontWeight="bold">
          {formatMessage({
            id: getTranslation('containers.ListPage.displayedFields'),
            defaultMessage: 'Displayed fields',
          })}
        </Typography>
        <Typography variant="pi" textColor="neutral600">
          {formatMessage({
            id: 'containers.SettingPage.editSettings.description',
            defaultMessage: 'Drag & drop the fields to build the layout',
          })}
        </Typography>
      </Flex>
      <Box padding={4} hasRadius borderStyle="dashed" borderWidth="1px" borderColor="neutral300">
        <Flex direction="column" alignItems="stretch" gap={2}>
          {layout.map((row, rowIndex) => (
            <Grid gap={2} key={rowIndex}>
              {row.map(({ size, ...field }, fieldIndex) => (
                <GridItem key={field.name} col={size}>
                  <Field
                    attribute={attributes[field.name]}
                    components={components}
                    index={[rowIndex, fieldIndex]}
                    name={`layout.${rowIndex}.${fieldIndex}`}
                    onMoveField={handleMoveField}
                  />
                </GridItem>
              ))}
            </Grid>
          ))}
          <Menu.Root>
            <Menu.Trigger
              startIcon={<Plus />}
              endIcon={null}
              disabled={remainingFields.length === 0}
              fullWidth
              variant="secondary"
            >
              {formatMessage({
                id: getTranslation('containers.SettingPage.add.field'),
                defaultMessage: 'Insert another field',
              })}
            </Menu.Trigger>
            <Menu.Content>
              {remainingFields.map((field) => (
                <Menu.Item
                  key={field}
                  onSelect={() => {
                    console.log('add field');
                  }}
                >
                  {field}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Root>
        </Flex>
      </Box>
    </Flex>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Field
 * -----------------------------------------------------------------------------------------------*/

interface FieldProps extends Pick<EditFieldFormProps, 'name' | 'attribute'> {
  components: EditLayout['components'];
  index: [row: number, index: number];
  onMoveField: UseDragAndDropOptions<number[]>['onMoveItem'];
}

const TEMP_FIELD_NAME = '_TEMP_';

/**
 * Displays a field in the layout with drag options, also
 * opens a modal  to edit the details of said field.
 */
const Field = ({ attribute, components, name, index, onMoveField }: FieldProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { formatMessage } = useIntl();

  const { value, onChange } = useField<ConfigurationFormData['layout'][number][number]>(name);

  const [{ isDragging }, objectRef, dropRef, dragRef, dragPreviewRef] = useDragAndDrop<
    Array<number>
  >(true, {
    type: ItemTypes.EDIT_FIELD,
    item: { index, label: value?.label, name },
    index,
    onMoveItem: onMoveField,
  });

  React.useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: false });
  }, [dragPreviewRef]);

  const composedRefs = useComposedRefs<HTMLSpanElement>(dragRef, objectRef);

  const handleRemoveField = () => {
    onChange(name, undefined);
  };

  if (!value) {
    return null;
  }

  return (
    <>
      <Flex
        borderColor="neutral150"
        background="neutral100"
        hasRadius
        pointerEvents={value.name === TEMP_FIELD_NAME ? 'none' : 'auto'}
        style={{ opacity: value.name === TEMP_FIELD_NAME ? 0 : isDragging ? 0.5 : 1 }}
        ref={dropRef}
        gap={3}
        cursor="pointer"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <DragButton
          as="span"
          aria-label={formatMessage(
            {
              id: getTranslation('components.DraggableCard.move.field'),
              defaultMessage: 'Move {item}',
            },
            { item: value.label }
          )}
          onClick={(e) => e.stopPropagation()}
          ref={composedRefs}
        >
          <Drag />
        </DragButton>
        <Flex direction="column" alignItems="flex-start" grow={1} overflow="hidden">
          <Flex gap={3} justifyContent="space-between" width="100%">
            <Typography ellipsis fontWeight="bold">
              {value.label}
            </Typography>
            <Flex>
              <IconButton
                borderWidth={0}
                background="transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                aria-label={formatMessage(
                  {
                    id: getTranslation('components.DraggableCard.edit.field'),
                    defaultMessage: 'Edit {item}',
                  },
                  { item: value.label }
                )}
              >
                <Pencil />
              </IconButton>
              <IconButton
                borderWidth={0}
                onClick={handleRemoveField}
                background="transparent"
                aria-label={formatMessage(
                  {
                    id: getTranslation('components.DraggableCard.delete.field'),
                    defaultMessage: 'Delete {item}',
                  },
                  { item: value.label }
                )}
              >
                <Cross />
              </IconButton>
            </Flex>
          </Flex>
          {attribute?.type === 'component' ? (
            <Flex
              paddingTop={3}
              paddingRight={3}
              paddingBottom={3}
              paddingLeft={0}
              alignItems="flex-start"
              direction="column"
              gap={2}
              width="100%"
            >
              <Grid gap={4} width="100%">
                {components[attribute.component].layout.map((row) =>
                  row.map(({ size, ...field }) => (
                    <GridItem key={field.name} col={size}>
                      <Flex
                        alignItems="center"
                        background="neutral0"
                        paddingTop={2}
                        paddingBottom={2}
                        paddingLeft={3}
                        paddingRight={3}
                        hasRadius
                        borderColor="neutral200"
                      >
                        <Typography textColor="neutral800">{field.name}</Typography>
                      </Flex>
                    </GridItem>
                  ))
                )}
              </Grid>
              <Link
                startIcon={<Cog />}
                as={NavLink}
                // @ts-expect-error – DS does not infer props from the `as` prop
                to={`../components/${attribute.component}/configurations/edit`}
              >
                {formatMessage({
                  id: getTranslation('components.FieldItem.linkToComponentLayout'),
                  defaultMessage: "Set the component's layout",
                })}
              </Link>
            </Flex>
          ) : null}
          {attribute?.type === 'dynamiczone' ? (
            <Flex
              paddingTop={3}
              paddingRight={3}
              paddingBottom={3}
              paddingLeft={0}
              alignItems="flex-start"
              gap={2}
              width="100%"
            >
              {attribute?.components.map((uid) => (
                <ComponentLink key={uid} to={`../components/${uid}/configurations/edit`}>
                  <ComponentIcon icon={components[uid].settings.icon} />
                  <Typography fontSize={1} textColor="neutral600" fontWeight="bold">
                    {components[uid].settings.displayName}
                  </Typography>
                </ComponentLink>
              ))}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      {isModalOpen && value.name !== TEMP_FIELD_NAME && (
        <EditFieldForm
          attribute={attribute}
          name={`layout.${index[0]}.${index[1]}`}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

const DragButton = styled(IconButton)`
  height: unset;
  align-self: stretch;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spaces[3]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral150};
  cursor: all-scroll;

  svg {
    width: ${12 / 16}rem;
    height: ${12 / 16}rem;
  }
`;

const ComponentLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaces[1]};
  padding: ${(props) => props.theme.spaces[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: ${({ theme }) => theme.colors.neutral0};
  width: 8.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;

  &:focus,
  &:hover {
    ${({ theme }) => `
      background-color: ${theme.colors.primary100};
      border-color: ${theme.colors.primary200};

      ${Typography} {
          color: ${theme.colors.primary600};
      }
    `}

    /* > ComponentIcon */
    > div:first-child {
      background: ${({ theme }) => theme.colors.primary200};
      color: ${({ theme }) => theme.colors.primary600};

      svg {
        path {
          fill: ${({ theme }) => theme.colors.primary600};
        }
      }
    }
  }
`;

export { Fields, TEMP_FIELD_NAME };
export type { FieldsProps };
