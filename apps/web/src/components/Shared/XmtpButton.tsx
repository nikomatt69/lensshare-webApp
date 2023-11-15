import { Button } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useClient } from '@xmtp/react-sdk';
import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';
type XMTPConnectButtonProps = {
 
};
const XMTPConnectButton: React.FC<XMTPConnectButtonProps> = () => {
  const { initialize } = useClient();
  const { data: walletClient } = useWalletClient();

  const handleConnect = useCallback(() => {
    void initialize({
      signer: walletClient
    });
  }, [initialize, walletClient]);

  return (
    <Button
      className={cn({ 'text-sm': true }, 'mr-auto')}
      onClick={handleConnect}
    >
      Connect To XMTP
    </Button>
  );
};
export default XMTPConnectButton;
