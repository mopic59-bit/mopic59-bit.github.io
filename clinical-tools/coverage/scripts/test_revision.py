import importlib.util, pathlib, unittest, copy, tempfile, json, sys
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('checker',pathlib.Path(__file__).with_name('check_revision.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class RevisionTest(unittest.TestCase):
 def setUp(self):self.a=dict(id='1',notice='2026-162',issuedDate='2026-07-30',effectiveDate='2026-07-31',files=[dict(key='annex4-hwp',sha256='old')])
 def test_unchanged(self):self.assertEqual(m.compare(self.a,copy.deepcopy(self.a)),[])
 def test_same_notice_file_change(self):
  b=copy.deepcopy(self.a);b['files'][0]['sha256']='new';self.assertEqual(m.compare(self.a,b)[0]['field'],'attachment');self.assertEqual(self.a['files'][0]['sha256'],'old')
 def test_notice_change(self):
  b=copy.deepcopy(self.a);b['notice']='2026-999';self.assertEqual(m.compare(self.a,b)[0]['field'],'notice')
 def test_add_remove(self):
  b=copy.deepcopy(self.a);b['files']=[dict(key='annex5-hwp',sha256='new')];self.assertEqual(len(m.compare(self.a,b)),2)
 def test_metadata_only(self):
  b=copy.deepcopy(self.a);b['effectiveDate']='2027-01-01';self.assertEqual(m.compare(self.a,b)[0]['field'],'effectiveDate')
class WorkflowTest(unittest.TestCase):
 def run_check(self, observed=None, failure=None, partial=False):
  temp=tempfile.TemporaryDirectory(); self.addCleanup(temp.cleanup);root=pathlib.Path(temp.name);rev=root/'revision';rev.mkdir()
  a=dict(id='1',notice='2026-162',issuedDate='2026-07-30',effectiveDate='2026-07-31',files=[],annexCount=15)
  m.save(rev/'applied.json',a);m.save(rev/'secondary-baseline.json',[]);m.save(rev/'status.json',dict(applied={k:v for k,v in a.items() if k!='files'},lastSuccessfulCheckAt='2026-01-01T00:00:00+00:00',pending=None))
  args=['check','--root',str(root),'--cache',str(root/'cache')]
  with patch.object(sys,'argv',args), patch.object(m,'observe',side_effect=failure,return_value=observed or a),patch.object(m,'secondary',side_effect=RuntimeError('secondary offline') if partial else None,return_value=([],[])):
   m.main()
  self.assertEqual(json.loads((rev/'applied.json').read_text()),a)
  return json.loads((rev/'status.json').read_text())
 def test_failure_retains_success(self):
  s=self.run_check(failure=RuntimeError('official offline'));self.assertEqual(s['lastSuccessfulCheckAt'],'2026-01-01T00:00:00+00:00');self.assertEqual(s['checkState'],'failed')
 def test_partial_retains_success(self):
  s=self.run_check(partial=True);self.assertEqual(s['lastSuccessfulCheckAt'],'2026-01-01T00:00:00+00:00');self.assertEqual(s['checkState'],'partial')
 def test_new_notice_pending_without_apply(self):
  s=self.run_check(observed=dict(id='2',notice='2026-999',issuedDate='2026-10-17',effectiveDate='2027-01-01',files=[],annexCount=15));self.assertEqual(s['revisionState'],'pending');self.assertEqual(s['applied']['notice'],'2026-162');self.assertIsNotNone(s['pending'])
if __name__=='__main__': unittest.main()
