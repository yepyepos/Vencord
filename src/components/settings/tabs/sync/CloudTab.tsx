/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useSettings } from "@api/Settings";
import { authorizeCloud, deauthorizeCloud } from "@api/SettingsSync/cloudSetup";
import { deleteCloudSettings, eraseAllCloudData, getCloudSettings, getCloudSyncDirection, putCloudSettings, setCloudSyncDirection } from "@api/SettingsSync/cloudSync";
import { BaseText } from "@components/BaseText";
import { Button, ButtonProps } from "@components/Button";
import { CheckedTextInput } from "@components/CheckedTextInput";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { FormSwitch } from "@components/FormSwitch";
import { Grid } from "@components/Grid";
import { Heading } from "@components/Heading";
import { CloudDownloadIcon, CloudUploadIcon, DeleteIcon, RestartIcon } from "@components/Icons";
import { Link } from "@components/Link";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { t, useVencordLocale } from "@i18n";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { IconComponent } from "@utils/types";
import { ConfirmModal,openModal, Select, Tooltip, useState } from "@webpack/common";

function validateUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return t("ui.cloud.invalidUrl", "Invalid URL");
    }
}

const SectionHeading = ({ text }: { text: string; }) => (
    <BaseText
        tag="h5"
        size="lg"
        weight="semibold"
        className={Margins.bottom16}
    >
        {text}
    </BaseText>
);

function ButtonWithIcon({ children, Icon, className, ...buttonProps }: ButtonProps & { Icon: IconComponent; }) {
    return (
        <Button {...buttonProps} className={classes("vc-cloud-icon-with-button", className)}>
            <Icon className={"vc-cloud-button-icon"} />
            {children}
        </Button>
    );
}

function CloudSetupSection() {
    const { cloud } = useSettings(["cloud.authenticated", "cloud.url"]);

    return (
        <section>
            <SectionHeading text={t("ui.cloud.integrations.heading", "Cloud Integrations")} />

            <Paragraph size="md" className={Margins.bottom20}>
                {t("ui.cloud.intro.prefix", "Vencord comes with a cloud integration that adds goodies like settings sync across devices. It ")}
                <Link href="https://vencord.dev/cloud/privacy">{t("ui.cloud.intro.privacyLink", "respects your privacy")}</Link>{t("ui.cloud.intro.middle", ", and the ")}
                <Link href="https://github.com/Vencord/Backend">{t("ui.cloud.intro.sourceLink", "source code")}</Link>{t("ui.cloud.intro.suffix", " is AGPL 3.0 licensed so you can host it yourself.")}
            </Paragraph>
            <FormSwitch
                key="backend"
                title={t("ui.cloud.integrations.title", "Enable Cloud Integrations")}
                description={t("ui.cloud.integrations.description", "This will request authorization if you have not yet set up cloud integrations.")}
                value={cloud.authenticated}
                onChange={v => {
                    if (v)
                        authorizeCloud();
                    else
                        cloud.authenticated = v;
                }}
            />
            <Heading tag="h5" className={Margins.top16}>{t("ui.cloud.backendUrl.heading", "Backend URL")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("ui.cloud.backendUrl.description", "Which backend to use when using cloud integrations.")}
            </Paragraph>
            <CheckedTextInput
                key="backendUrl"
                initialValue={cloud.url}
                onChange={async v => {
                    cloud.url = v;
                    cloud.authenticated = false;
                    deauthorizeCloud();
                }}
                validate={validateUrl}
            />

            <Grid columns={1} gap="1em" className={Margins.top8}>
                <ButtonWithIcon
                    variant="primary"
                    disabled={!cloud.authenticated}
                    onClick={async () => {
                        await deauthorizeCloud();
                        cloud.authenticated = false;
                        await authorizeCloud();
                    }}
                    Icon={RestartIcon}
                >
                    {t("ui.cloud.reauthorise", "Reauthorise")}
                </ButtonWithIcon>
            </Grid>
        </section>
    );
}

function SettingsSyncSection() {
    const { cloud } = useSettings(["cloud.authenticated", "cloud.settingsSync"]);
    const [syncDirection, setSyncDirection] = useState(getCloudSyncDirection);
    const sectionEnabled = cloud.authenticated && cloud.settingsSync;

    return (
        <section>
            <SectionHeading text={t("ui.cloud.sync.heading", "Settings Sync")} />
            <Flex flexDirection="column" gap="1em">
                <FormSwitch
                    key="cloud-sync"
                    title={t("ui.cloud.sync.title", "Enable Settings Sync")}
                    description={t("ui.cloud.sync.description", "Save your Vencord settings to the cloud so you can easily keep them the same on all your devices")}
                    value={cloud.settingsSync}
                    onChange={v => { cloud.settingsSync = v; }}
                    disabled={!cloud.authenticated}
                    hideBorder
                />

                <div>
                    <Heading tag="h5">
                        {t("ui.cloud.syncRules.heading", "Sync Rules for This Device")}
                    </Heading>
                    <Paragraph className={Margins.bottom8}>
                        {t("ui.cloud.syncRules.prefix", "This setting controls how settings move between ")}<strong>{t("ui.cloud.syncRules.thisDevice", "this device")}</strong>{t("ui.cloud.syncRules.suffix", " and the cloud. You can let changes flow both ways, or choose one place to be the main source of truth.")}
                    </Paragraph>
                    <Select
                        options={[
                            {
                                label: t("ui.cloud.sync.twoWay", "Two-way sync (changes go both directions)"),
                                value: "both",
                                default: true,
                            },
                            {
                                label: t("ui.cloud.sync.uploadOnly", "This device is the source (upload only)"),
                                value: "push",
                            },
                            {
                                label: t("ui.cloud.sync.downloadOnly", "The cloud is the source (download only)"),
                                value: "pull",
                            },
                            {
                                label: t("ui.cloud.sync.manual", "Do not sync automatically (manual sync via buttons below only)"),
                                value: "manual",
                            }
                        ]}
                        isSelected={v => v === syncDirection}
                        serialize={v => String(v)}
                        select={v => {
                            setCloudSyncDirection(v);
                            setSyncDirection(v);
                        }}
                        closeOnSelect={true}
                    />
                </div>

                <Grid columns={2} gap="1em" className={Margins.top20}>
                    <ButtonWithIcon
                        variant="positive"
                        disabled={!sectionEnabled}
                        onClick={() => putCloudSettings(true)}
                        Icon={CloudUploadIcon}
                    >
                        {t("ui.cloud.uploadSettings", "Upload Settings")}
                    </ButtonWithIcon>
                    <Tooltip text={t("ui.cloud.replaceWarning", "This will replace your current settings with the ones saved in the cloud. Be careful!")}>
                        {({ onMouseLeave, onMouseEnter }) => (
                            <ButtonWithIcon
                                variant="dangerPrimary"
                                onMouseLeave={onMouseLeave}
                                onMouseEnter={onMouseEnter}
                                disabled={!sectionEnabled}
                                onClick={() => getCloudSettings(true, true)}
                                Icon={CloudDownloadIcon}
                            >
                                {t("ui.cloud.downloadSettings", "Download Settings")}
                            </ButtonWithIcon>
                        )}
                    </Tooltip>
                </Grid>
            </Flex>
        </section>
    );
}

function ResetSection() {
    const { authenticated, settingsSync } = useSettings(["cloud.authenticated", "cloud.settingsSync"]).cloud;

    return (
        <section>
            <SectionHeading text={t("ui.cloud.reset.heading", "Reset Cloud Data")} />

            <Grid columns={2} gap="1em">
                <ButtonWithIcon
                    variant="dangerPrimary"
                    disabled={!authenticated || !settingsSync}
                    onClick={() => deleteCloudSettings()}
                    Icon={DeleteIcon}
                >
                    Delete Settings from Cloud
                </ButtonWithIcon>
                <ButtonWithIcon
                    variant="dangerPrimary"
                    disabled={!authenticated}
                    onClick={() => openModal(props => (
                        <ConfirmModal
                            {...props}
                            title={t("ui.cloud.reset.confirmTitle", "Are you sure?")}
                            subtitle={t("ui.cloud.reset.confirmSubtitle", "Once your data is erased, we cannot recover it. There's no going back!")}
                            onConfirm={eraseAllCloudData}
                            confirmText={t("ui.cloud.reset.erase", "Erase it!")}
                            cancelText={t("ui.cloud.reset.nevermind", "Nevermind")}
                        />
                    ))}
                    Icon={DeleteIcon}
                >
                    {t("ui.cloud.deleteAccount", "Delete your Cloud Account")}
                </ButtonWithIcon>
            </Grid>
        </section>
    );
}

function CloudTab() {
    useVencordLocale();
    return (
        <SettingsTab>
            <Flex flexDirection="column" gap="1em">
                <CloudSetupSection />
                <Divider />
                <SettingsSyncSection />
                <Divider />
                <ResetSection />
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(CloudTab, "Cloud");
