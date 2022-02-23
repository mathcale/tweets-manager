import { useState } from 'react';
import { useRouter } from 'next/router';
import { Theme, styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import electron from 'electron';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const ipcRenderer = electron.ipcRenderer;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const Input = styled('input')({
  display: 'none',
});

export default function HomePage(): JSX.Element {
  const classes = useStyles({});
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAnalyzeButtonClick = async (): Promise<void | never> => {
    setIsLoading(true);

    try {
      await ipcRenderer.invoke('archive/analyze', archiveFile.path);
      router.push('/bad-tweets');
    } catch (err) {
      console.error('[HomePage.onAnalyzeButtonClick]', err.message);
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <div className={classes.root}>
        <Typography variant="h4">Tweets Manager</Typography>

        <Typography variant="subtitle1" gutterBottom>
          Manage your tweets
        </Typography>

        <Typography>
          Select your downloaded <pre style={{ display: 'inline-block' }}>.zip</pre> archive
        </Typography>

        <Box sx={{ mb: 2 }}>
          <label htmlFor="contained-button-file">
            <Input
              type="file"
              id="contained-button-file"
              accept="application/zip"
              onChange={(e) => setArchiveFile(e.target.files[0])}
            />

            <Button variant="outlined" color="primary" component="span" disabled={isLoading}>
              Choose file
            </Button>
          </label>
        </Box>

        <LoadingButton variant="contained" loading={isLoading} onClick={onAnalyzeButtonClick}>
          Analyze
        </LoadingButton>
      </div>
    </>
  );
}
