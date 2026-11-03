import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getReleases, launcherBuild } from "@/components/github-releases";
import { DownloadIcon } from "@/components/icons";
import { LauncherLink } from "@/components/launcher-download";
import { PixelAurora } from "@/components/pixel-aurora";
import { ClaimDate, Countdown, FounderSet } from "@/components/shop/shop-view";
import { getShopArt, getShopStatus } from "@/components/shop-data";
import { pageMetadata } from "@/components/site";
import "./shop.css";

// Shown only while the cosmetics service says the founder set's claim window is open (components/shop-data.ts):
// before that, and after it, /shop is a 404 and nothing links to it.

export async function generateMetadata(): Promise<Metadata> {
  const shop = await getShopStatus();
  if (!shop.open) return { title: "Nothing at this address · Horizon", robots: { index: false, follow: false } };
  const meta = pageMetadata({
    title: "The founder set, free · Horizon",
    description:
      "Four cosmetics for the players who were here first, free to claim in the Horizon launcher for a limited time. Only Horizon players see them, and they change nothing about how the game plays.",
    path: "/shop",
  });
  return shop.preview ? { ...meta, robots: { index: false, follow: false } } : meta;
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="rounded-2xl bg-white/[0.06] p-6 backdrop-blur-xl">
      <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-lg bg-[#6b4bff]/25 font-display text-[15px] font-semibold text-[#d9ceff]">
        {n}
      </span>
      <h3 className="mt-4 font-display text-[19px] leading-tight font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <div className="mt-2 text-[15px] leading-relaxed text-white/70">{children}</div>
    </li>
  );
}

function Fact({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-display text-[17px] font-semibold text-white">{title}</dt>
      <dd className="mt-1.5 text-[15px] leading-relaxed text-white/70">{children}</dd>
    </div>
  );
}

const LINK = "text-[#c4b5ff] underline decoration-[#c4b5ff]/40 underline-offset-4 transition-colors hover:text-white";

export default async function ShopPage() {
  const shop = await getShopStatus();
  if (!shop.open || shop.endsAt === null) notFound();
  const [art, releases] = await Promise.all([getShopArt(shop.items), getReleases()]);
  const launcher = launcherBuild(releases);
  const endsAt = shop.endsAt;

  return (
    <main>
      <section aria-labelledby="shop-title" className="relative isolate overflow-hidden">
        <PixelAurora className="absolute top-0 left-0 -z-10 opacity-70" moonTop={150} />
        <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 sm:pt-40 sm:pb-20 lg:px-10">
          <p className="text-sm font-medium text-white/60">Shop</p>
          <h1 id="shop-title" className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-white">
            <span className="block">The founder set</span>
            <span className="text-accent block pb-1">is free.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Four things for the players who were here first: a visor, a little sun for your shoulder, a name tag and a launcher theme. Claim them in the
            Horizon launcher; once claimed, they&apos;re yours to keep.
          </p>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-white/[0.06] p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[15px] text-white/60">Free to claim until</p>
              <p className="mt-1 font-display text-[22px] leading-tight font-semibold tracking-[-0.01em] text-white">
                <ClaimDate endsAt={endsAt} />
              </p>
              <p className="mt-1 text-[15px] text-[#c4b5ff]">
                <Countdown endsAt={endsAt} />
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <LauncherLink
                build={launcher}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-[10px] bg-[#6b4bff] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[#7a5dff]"
              >
                <DownloadIcon className="size-[18px]" />
                Get the launcher
              </LauncherLink>
              <a
                href="#claim"
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-white/[0.08] px-5 text-[15px] font-medium text-white transition-colors hover:bg-white/[0.14]"
              >
                How to claim
              </a>
            </div>
          </div>

          <div className="mt-12">
            <FounderSet items={shop.items} art={art} />
          </div>
        </div>
      </section>

      <section id="claim" aria-labelledby="claim-title" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 lg:px-10">
          <p className="text-sm font-medium text-white/60">How to claim</p>
          <h2 id="claim-title" className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em] text-white">
            In the launcher, in three steps.
          </h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-3">
            <Step n={1} title="Get the launcher">
              Download Horizon&apos;s launcher for Windows, macOS or Linux, or update the one you have.{" "}
              <LauncherLink build={launcher} className={LINK}>
                Download it
              </LauncherLink>
              .
            </Step>
            <Step n={2} title="Sign in with Microsoft">
              Sign in with the Microsoft account that owns Minecraft: Java Edition. Microsoft&apos;s own sign-in opens; Horizon never sees your password.
            </Step>
            <Step n={3} title="Claim the set">
              Open <span className="text-white">Wardrobe</span> in the launcher&apos;s top bar and press <span className="text-white">Claim the founder set</span>. Then put
              on what you like.
            </Step>
          </ol>
          <p className="mt-6 max-w-3xl rounded-2xl bg-white/[0.03] p-5 text-[15px] leading-relaxed text-white/70 ring-1 ring-white/[0.08]">
            <span className="font-medium text-white">This website never signs you in.</span> There is nothing to pay and no card to give. If a page, a message or
            a mod asks for your password or a payment to get the founder set, it isn&apos;t Horizon.
          </p>
        </div>
      </section>

      <section aria-labelledby="facts-title">
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-28 lg:px-10">
          <h2 id="facts-title" className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em] text-white">
            Good to know
          </h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            <Fact title="Who sees it">
              Horizon players near you, in every world and on every server. Other clients see a normal player: servers receive nothing, and the game&apos;s
              protocol doesn&apos;t change.
            </Fact>
            <Fact title="What it changes">How you look. Nothing about how the game plays.</Fact>
            <Fact title="Bound to your account">
              The set belongs to the Minecraft account you claim it with, on every computer you sign in to. It&apos;s yours to keep.
            </Fact>
            <Fact title="Hide it">
              <span className="text-white">Show my cosmetics</span> in the Wardrobe turns yours off for everyone. You can hide other players&apos; cosmetics too,
              in the launcher or in the game&apos;s options.
            </Fact>
            <Fact title="What Horizon keeps">
              For your Minecraft account: the items you own and since when, what you wear, whether you hid them, and when you claimed the set. Nothing else.
            </Fact>
            <Fact title={`After ${lastDayShort(endsAt)}`}>The founder set retires for good: it won&apos;t be offered again, and it will never be sold.</Fact>
          </dl>
          <p className="mt-14 text-[15px] text-white/60">
            Making blocky models is your thing?{" "}
            <Link href="/artists" className={LINK}>
              Horizon is looking for 3D artists
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function lastDayShort(endsAt: number) {
  const end = new Date(endsAt * 1000);
  const midnight = end.getUTCHours() === 0 && end.getUTCMinutes() === 0;
  return new Date((midnight ? endsAt - 1 : endsAt) * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
}
