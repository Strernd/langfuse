import { env } from "@/src/env.mjs";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Divider } from "@tremor/react";
import { usePostHog } from "posthog-js/react";

const regions =
  env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION === "STAGING"
    ? [
        {
          name: "EU (Staging)",
          hostname: "staging.langfuse.com",
          flag: "🇪🇺",
        },
      ]
    : [
        {
          name: "US",
          hostname: "us.cloud.langfuse.com",
          flag: "🇺🇸",
        },
        {
          name: "EU",
          hostname: "cloud.langfuse.com",
          flag: "🇪🇺",
        },
      ];

export function CloudRegionSwitch({
  isSignUpPage,
}: {
  isSignUpPage?: boolean;
}) {
  const posthog = usePostHog();

  if (env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION === undefined) return null;

  return (
    <div>
      <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <span className="text-sm font-medium leading-none">Data Region</span>
          <p className="text-xs text-gray-500">
            Regions are strictly separated.
          </p>
          {env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION !== undefined &&
          isSignUpPage ? (
            <p className="text-xs text-gray-500">
              {env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION === "EU"
                ? "✅ Demo project available"
                : "❌ Choose EU for demo project access"}
            </p>
          ) : null}
        </div>
        <Tabs value={env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION}>
          <TabsList>
            {regions.map((region) => (
              <TabsTrigger
                key={region.name}
                value={region.name}
                onClick={() => {
                  posthog.capture(
                    "cloud_region_switch",
                    {
                      region: region.name,
                    },
                    {
                      send_instantly: true,
                    },
                  );
                  window.location.hostname = region.hostname;
                }}
              >
                <span className="mr-2 text-xl leading-none">{region.flag}</span>
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Divider className="text-gray-400" />
    </div>
  );
}
