import React, { useState } from 'react';
import {
  EuiBreadcrumb,
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSectionItemButton,
  EuiHeaderSectionItem,
  EuiSwitch,
  EuiSpacer,
  EuiFlexItem,
  EuiAvatar,
  EuiHeaderSection,
  EuiFlexGroup,
  EuiIcon,
  EuiBadge,
  EuiButtonEmpty,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiHeaderAlert,
  EuiLink,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiPortal,
  EuiText,
  EuiTitle,
  useGeneratedHtmlId,
  useEuiTheme,
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';
import { clearAllStores } from '../../indexeddb'
import dark_logo from '../assests/dark_logo.jpeg'
import bright_logo from '../assests/bright_logo.jpeg'
import HeaderTabs from './HeaderTabs';

const HeaderUpdates = () => {
  const { euiTheme } = useEuiTheme();
  

  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const newsFeedFlyoutId = useGeneratedHtmlId({ prefix: 'newsFeedFlyout' });
  const newsFeedFlyoutTitleId = useGeneratedHtmlId({
    prefix: 'newsFeedFlyoutTitle',
  });
  const newsFeedPopoverId = useGeneratedHtmlId({ prefix: 'newsFeedPopover' });

  const alerts = [
    {
      title: 'Control access to features',
      text: 'Show or hide applications and features per space in Kibana.',
      action: <EuiLink href="">Learn about feature controls</EuiLink>,
      date: '1 May 2019',
      badge: <EuiBadge>7.1</EuiBadge>,
    },
    {
      title: 'Kibana 7.0 is turning heads',
      text: 'Simplified navigation, responsive dashboards, dark mode… pick your favorite.',
      action: (
        <EuiLink
          target="_blank"
          external
          href="https://www.elastic.co/blog/kibana-7-0-0-released"
        >
          Read the blog
        </EuiLink>
      ),
      date: '10 April 2019',
      badge: <EuiBadge color="hollow">7.0</EuiBadge>,
    },
    {
      title: 'Enter dark mode',
      text: 'Kibana now supports the easy-on-the-eyes theme across the entire UI.',
      action: <EuiLink href="">Go to Advanced Settings</EuiLink>,
      date: '10 April 2019',
      badge: <EuiBadge color="hollow">7.0</EuiBadge>,
    },
    {
      title: 'Pixel-perfect Canvas is production ready',
      text: 'Your creative space for visualizing data awaits.',
      action: (
        <EuiLink
          target="_blank"
          external
          href="https://www.elastic.co/webinars/intro-to-canvas-a-new-way-to-tell-visual-stories-in-kibana"
        >
          Watch the webinar
        </EuiLink>
      ),
      date: '26 March 2019',
      badge: <EuiBadge color="hollow">6.7</EuiBadge>,
    },
    {
      title: '6.7 release notes',
      text: 'Stay up-to-date on the latest and greatest features.',
      action: (
        <EuiLink
          target="_blank"
          external
          href="https://www.elastic.co/guide/en/kibana/6.7/release-notes-6.7.0.html"
        >
          Check out the docs
        </EuiLink>
      ),
      date: '26 March 2019',
      badge: <EuiBadge color="hollow">6.7</EuiBadge>,
    },
    {
      title: 'Rollups made simple in Kibana',
      text: 'Save space and preserve the integrity of your data directly in the UI.',
      action: (
        <EuiLink
          target="_blank"
          external
          href="https://www.elastic.co/blog/how-to-create-manage-and-visualize-elasticsearch-rollup-data-in-kibana"
        >
          Read the blog
        </EuiLink>
      ),
      date: '10 January 2019',
      badge: <EuiBadge color="hollow">6.5</EuiBadge>,
    },
  ];

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
  };

  const closePopover = () => {
    setIsPopoverVisible(false);
  };

  const showFlyout = () => {
    setIsFlyoutVisible(!isFlyoutVisible);
  };

  const bellButton = (
    <EuiHeaderSectionItemButton
      aria-controls="headerFlyoutNewsFeed"
      aria-expanded={isFlyoutVisible}
      aria-haspopup="true"
      aria-label={'Alerts feed: Updates available'}
      onClick={() => showFlyout()}
      notification={true}
    >
      <EuiIcon type="bell" />
    </EuiHeaderSectionItemButton>
  );

  const flyout = (
    <EuiPortal>
      <EuiFlyout
        onClose={closeFlyout}
        size="s"
        id={newsFeedFlyoutId}
        aria-labelledby={newsFeedFlyoutTitleId}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="s">
            <h2 id={newsFeedFlyoutTitleId}>What's new</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          {alerts.map((alert, i) => (
            <EuiHeaderAlert
              key={`alert-${i}`}
              title={alert.title}
              action={alert.action}
              text={alert.text}
              date={alert.date}
              badge={alert.badge}
            />
          ))}
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={closeFlyout}
                flush="left"
              >
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText color="subdued" size="s">
                <p>Version 7.0</p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    </EuiPortal>
  );

  return (
    <>
      {bellButton}
      {isFlyoutVisible && flyout}
    </>
  );
};

const HeaderUserMenu = ({details}) => {
  console.log("details",details)
  const navigate = useNavigate()
  const userPopoverId = useGeneratedHtmlId({ prefix: 'userPopover' });
  const [isOpen, setIsOpen] = useState(false);

  const onMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
// console.log("details",details)
  const button = (
    <EuiHeaderSectionItemButton
      aria-controls={userPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
    >
      <EuiAvatar name={details?.first_name  +" " +details?.last_name} size="s" />
    </EuiHeaderSectionItemButton>
  );

  const handleLogout = async () => {
    localStorage.clear()
    clearAllStores();
    navigate("/login")
  }

  const gotToDetails = (details) => {
    console.log("user,item", details)
    navigate(`/all-users/details/${details.id}`, { state: details });
  }

  return (
    <EuiPopover
      id={userPopoverId}
      repositionOnScroll
      button={button}
      isOpen={isOpen}
      anchorPosition="downRight"
      closePopover={closeMenu}
      panelPaddingSize="m"
    >
      <div style={{ width: 300 }}>
        <EuiFlexGroup gutterSize="m" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiAvatar name={details.first_name +" " +details.last_name} size="xl" />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiText>
              <p>{details.first_name +" " +details.last_name}</p>
            </EuiText>

            <EuiSpacer size="m" />

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFlexGroup justifyContent="spaceBetween">
                  <EuiFlexItem grow={false} onClick={() => { gotToDetails(details) }}>
                    <EuiLink>Edit profile</EuiLink>
                  </EuiFlexItem>

                  <EuiFlexItem grow={false} onClick={() => handleLogout()}>
                    <EuiLink>Log out</EuiLink>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </EuiPopover>
  );
};

const AppHeader = () => {
  const [isFixed, setIsFixed] = useState(true);
  const [theme, setTheme] = useState('default');
  localStorage.setItem("theme",theme)
  const navigate = useNavigate()

  const UserDetailsd = localStorage.getItem('userData')
  const UserDetails = JSON.parse(UserDetailsd != "undefined" ?UserDetailsd :"")


  const breadcrumbs = [
    {
      text: 'Management',
      href: '#',
      onClick: (e) => {
        e.preventDefault();
      },
    },
    {
      text: 'Users',
    },
  ];

  return (
    <>
      <EuiSpacer />
      <EuiHeader
        theme={theme}
        position={isFixed ? 'fixed' : 'fixed'}
        sections={[
          {
            items: [
              <EuiHeaderSection>
                <EuiHeaderSectionItem>
                <div style={{marginLeft:"20px",cursor:"pointer"}}  onClick={()=>navigate("/dashboard")}>
                <img src={theme == "dark"?dark_logo:bright_logo} height={30} width={125}/>
                </div>
                  {/* <EuiHeaderLogo>Quantrade - AI</EuiHeaderLogo> */}
                </EuiHeaderSectionItem>
              </EuiHeaderSection>,
            ],
          },
          {
           items:[<HeaderTabs />]
          },

          {
            items: [
              <EuiHeaderSection side="right">
              
                <EuiFlexGroup alignItems="center" gutterSize="m">
                  <EuiFlexItem grow={false}>
                    <EuiSwitch
                      label={'Dark'}
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'default')}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiHeaderSectionItem>
                  <HeaderUpdates />
                </EuiHeaderSectionItem>
                <EuiHeaderSectionItem>
                  <HeaderUserMenu details={UserDetails?.user}/>
                </EuiHeaderSectionItem>
              </EuiHeaderSection>,
            ],
          },
        ]}
      />
    </>
  );
};

export default AppHeader;
