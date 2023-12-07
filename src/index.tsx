import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = { content?: string };
type IntegrationBlockState = { content: string };
type IntegrationAction = {};

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async () => {
    return new Response(
        `
<html>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #14171c;
    }
  </style>
  <body>
    <script
      type="module"
      src="https://unpkg.com/@inkeep/widgets-embed@0.2.226/dist/embed.js"
    ></script>
    <script type="module">
      const inkeepDiv = document.createElement("div");
      inkeepDiv.classList.add('inkeep-container');
      inkeepDiv.id = "inkeep";
      document.body.appendChild(inkeepDiv);

      const inkeepWidget = Inkeep().embed({
        componentType: "EmbeddedChat",
        targetElement: document.getElementById("inkeep"),
        properties: {
          baseSettings: {
            integrationId: "integrationId", // required
            apiKey: "apiKey", // required
            organizationId: "organizationId", // required
            primaryBrandColor: "#522FC9",
            //... optional base settings
            theme: {
              colorMode: {
                forcedColorMode: 'dark'
              }
            }
          },
          aiChatSettings: {
            quickQuestions: [
              "Example question 1?",
              "Example question 2?",
              "Example question 3?",
            ],
            getHelpCallToActions: [
              {
                icon: { builtIn: 'FaSlack' },
                name: 'Slack',
                url: 'https://myorg.slack.com/C010101010',
              },
              {
                icon: { builtIn: 'FaDiscord' },
                name: 'Discord',
                url: 'https://discord.com/invite/invidecode123',
              },
              {
                icon: { builtIn: 'FaGithub' },
                name: 'GitHub',
                url: 'https://github.com/myorg/myrepo/discussions',
              },
            ],
          },
          searchSettings: {
            // optional
          },
          modalSettings: {
            // optional
          },
        },
      });
    </script>
  </body>
</html>
`,
        {
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );
};

const inkeepChatComponent = createComponent<
    IntegrationBlockProps,
    IntegrationBlockState,
    IntegrationAction,
    IntegrationContext
>({
    componentId: 'Inkeep-chat',
    initialState: () => {
        return {
            content: ``,
        };
    },
    action: async () => {
        return {};
    },
    render: async (element, context) => {
        const { environment } = context;

        return (
            <block>
                <webframe
                    source={{
                        url: environment.integration.urls.publicEndpoint,
                    }}
                    aspectRatio={9 / 5}
                    data={{
                        content: element.dynamicState('content'),
                    }}
                />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [inkeepChatComponent],
});
