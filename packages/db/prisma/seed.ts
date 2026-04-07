import { PrismaClient, TaskType, TaskGroup, TaskParamType, TriggerKey, ActionKey } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // --- TRIGGERS ---
  
  // 1. LAUNCH_BROWSER
  await prisma.availableTrigger.upsert({
    where: { key: 'LAUNCH_BROWSER' },
    update: {},
    create: {
      name: 'Launch Browser',
      key: 'LAUNCH_BROWSER',
      taskInfo: {
        create: {
          label: 'Launch Browser',
          type: 'LAUNCH_BROWSER',
          group: 'BROWSER',
          isEntryPoint: true,
          credits: 5,
          testingAvailable: false,
          inputs: {
            create: [
              { name: 'Website URL', type: 'STRING', required: true, hideHandle: true, helperText: 'e.g., https://example.com' }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });
  console.log('Upserted trigger: LAUNCH_BROWSER');

  // --- ACTIONS ---

  // 1. PAGE_TO_HTML
  await prisma.availableAction.upsert({
    where: { key: 'PAGE_TO_HTML' },
    update: {},
    create: {
      name: 'Page to HTML',
      key: 'PAGE_TO_HTML',
      taskInfo: {
        create: {
          label: 'Page to HTML',
          type: 'PAGE_TO_HTML',
          group: 'BROWSER',
          isEntryPoint: false,
          credits: 2,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'HTML', type: 'STRING', required: true },
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  // 2. EXTRACT_TEXT_FROM_ELEMENT
  await prisma.availableAction.upsert({
    where: { key: 'EXTRACT_TEXT_FROM_ELEMENT' },
    update: {},
    create: {
      name: 'Extract Text From Element',
      key: 'EXTRACT_TEXT_FROM_ELEMENT',
      taskInfo: {
        create: {
          label: 'Extract Text From Element',
          type: 'EXTRACT_TEXT_FROM_ELEMENT',
          group: 'DATA_EXTRACTION',
          isEntryPoint: false,
          credits: 2,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'HTML', type: 'STRING', required: true, variant: 'textarea' },
              { name: 'Selector', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Extracted Text', type: 'STRING', required: true }
            ]
          }
        }
      }
    }
  });

  // 3. FILL_INPUT
  await prisma.availableAction.upsert({
    where: { key: 'FILL_INPUT' },
    update: {},
    create: {
      name: 'Fill Input',
      key: 'FILL_INPUT',
      taskInfo: {
        create: {
          label: 'Fill Input',
          type: 'FILL_INPUT',
          group: 'USER_INTERACTIONS',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true },
              { name: 'Selector', type: 'STRING', required: true },
              { name: 'Value', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  // 4. CLICK_ELEMENT
  await prisma.availableAction.upsert({
    where: { key: 'CLICK_ELEMENT' },
    update: {},
    create: {
      name: 'Click Element',
      key: 'CLICK_ELEMENT',
      taskInfo: {
        create: {
          label: 'Click Element',
          type: 'CLICK_ELEMENT',
          group: 'USER_INTERACTIONS',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true },
              { name: 'Selector', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  // 5. WAIT_FOR_ELEMENT
  await prisma.availableAction.upsert({
    where: { key: 'WAIT_FOR_ELEMENT' },
    update: {},
    create: {
      name: 'Wait For Element',
      key: 'WAIT_FOR_ELEMENT',
      taskInfo: {
        create: {
          label: 'Wait For Element',
          type: 'WAIT_FOR_ELEMENT',
          group: 'TIMING',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true },
              { name: 'Selector', type: 'STRING', required: true },
              { name: 'Visibility', type: 'SELECT', required: true, options: ['visible', 'hidden'] }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  // 6. EXTRACT_DATA_WITH_AI
  await prisma.availableAction.upsert({
    where: { key: 'EXTRACT_DATA_WITH_AI' },
    update: {},
    create: {
      name: 'Extract Data with AI',
      key: 'EXTRACT_DATA_WITH_AI',
      taskInfo: {
        create: {
          label: 'Extract Data with AI',
          type: 'EXTRACT_DATA_WITH_AI',
          group: 'DATA_EXTRACTION',
          isEntryPoint: false,
          credits: 5,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Credential', type: 'CREDENTIAL', required: true },
              { name: 'Prompt', type: 'STRING', required: true, variant: 'textarea' },
              { name: 'Content', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Extracted Data', type: 'STRING', required: true }
            ]
          }
        }
      }
    }
  });

  // 7. READ_PROPERTY_FROM_JSON
  await prisma.availableAction.upsert({
    where: { key: 'READ_PROPERTY_FROM_JSON' },
    update: {},
    create: {
      name: 'Read Property from JSON',
      key: 'READ_PROPERTY_FROM_JSON',
      taskInfo: {
        create: {
          label: 'Read Property from JSON',
          type: 'READ_PROPERTY_FROM_JSON',
          group: 'DATA_EXTRACTION',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'JSON', type: 'STRING', required: true, variant: 'textarea' },
              { name: 'Property Name', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Property Value', type: 'STRING', required: true }
            ]
          }
        }
      }
    }
  });

  // 8. ADD_PROPERTY_TO_JSON
  await prisma.availableAction.upsert({
    where: { key: 'ADD_PROPERTY_TO_JSON' },
    update: {},
    create: {
      name: 'Add Property to JSON',
      key: 'ADD_PROPERTY_TO_JSON',
      taskInfo: {
        create: {
          label: 'Add Property to JSON',
          type: 'ADD_PROPERTY_TO_JSON',
          group: 'DATA_STORAGE',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'JSON', type: 'STRING', required: true, variant: 'textarea' },
              { name: 'Property Name', type: 'STRING', required: true },
              { name: 'Property Value', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'JSON', type: 'STRING', required: true }
            ]
          }
        }
      }
    }
  });

  // 9. NAVIGATE_URL
  await prisma.availableAction.upsert({
    where: { key: 'NAVIGATE_URL' },
    update: {},
    create: {
      name: 'Navigate URL',
      key: 'NAVIGATE_URL',
      taskInfo: {
        create: {
          label: 'Navigate URL',
          type: 'NAVIGATE_URL',
          group: 'BROWSER',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true },
              { name: 'Website URL', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  // 10. SCROLL_TO_ELEMENT
  await prisma.availableAction.upsert({
    where: { key: 'SCROLL_TO_ELEMENT' },
    update: {},
    create: {
      name: 'Scroll to Element',
      key: 'SCROLL_TO_ELEMENT',
      taskInfo: {
        create: {
          label: 'Scroll to Element',
          type: 'SCROLL_TO_ELEMENT',
          group: 'USER_INTERACTIONS',
          isEntryPoint: false,
          credits: 1,
          testingAvailable: true,
          inputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true },
              { name: 'Selector', type: 'STRING', required: true }
            ]
          },
          outputs: {
            create: [
              { name: 'Web page', type: 'BROWSER_INSTANCE', required: true }
            ]
          }
        }
      }
    }
  });

  console.log('Upserted Actions successfully');
  
  // Link Triggers to Actions
  // Note: Your schema has "AvailableTriggerAction" join table, 
  // you may need to map what triggers support what actions if you have that logic,
  // but typically, all actions can join after.
  const allActions = await prisma.availableAction.findMany();
  const trigger = await prisma.availableTrigger.findUnique({ where: { key: 'LAUNCH_BROWSER' } });

  if(trigger) {
      for (const action of allActions) {
          await prisma.availableTriggerAction.upsert({
              where: {
                  triggerId_actionId: {
                      triggerId: trigger.id,
                      actionId: action.id
                  }
              },
              update: {},
              create: {
                  triggerId: trigger.id,
                  actionId: action.id
              }
          });
      }
      console.log('Linked LAUNCH_BROWSER trigger to all actions');
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
